#Env Import
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LicenseRenew.settings')

import re
import traceback
import sys
import fitz
import uuid
import pytesseract
from PIL import Image
from fuzzywuzzy import fuzz
from dateutil import parser
from docx import Document
from odf.opendocument import load 
from odf.text import P
from pdf2image import convert_from_path
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, APIView, permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets
from .serializers import SoftwareSerializer, NotifySerializer
from .models import Software, Notify
from .tasks import send_software_reminder
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from datetime import datetime
from rest_framework.decorators import action
from django.utils.timezone import now
import io
from datetime import date, timedelta
import pandas as pd
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework.permissions import AllowAny


# LicenseSerializer, NotificationSerializer
# License
# send_renewal_reminder

###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                             ###---USECASE2---###
def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file, with OCR for image-based PDFs."""
    try:
        doc = fitz.open(pdf_path)
        text = ""

        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")

            if page_text.strip():
                text += page_text
            else:
                print(f"No text found in page {page_num + 1}, attempting OCR...")
                pix = page.get_pixmap()
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                ocr_text = pytesseract.image_to_string(img, config="--psm 6")  
                text += ocr_text

        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# Function to detect license type
def detect_type_license(text):
    license_keywords = {
        "Subscription": ["UNPAID", "VAT Number", "Proforma Invoice", "Invoiced To"],
        "Perpetual": ["life time", "permanent"]
    }
    
    text = text.strip()
    for type_license, keywords in license_keywords.items():
        for keyword in keywords:
            if keyword.lower() in text.lower():
                return type_license
    print("No matching keywords found in extracted text:", text[:200]) 
    return None

def detect_software_name(text):
    license_keywords = {
        "Proprietary License": ["Proprietary", "Proprietary"],
        "Enterprise License": ["Enterprise", "enterprise"]
    }
    text = text.strip()
    for name, keywords in license_keywords.items():
        for keyword in keywords:
            if keyword.lower() in text.lower():
                return name
    return None

def detect_kra_pin(text):
    pattern = r"\b[A-Z]\d{9}[A-Z]\b"
    match = re.search(pattern, text)
    if match:
        return match.group(0)
    return "Unknown"

def detect_owner(text):
    match = re.search(r'Invoiced To\s*(.*?)\s*Client' , text)
    if match:
        return match.group(1).strip()
    return 'Unknown'

def detect_amount(text):
    match = re.search(r'Total\s*Ksh\.(\d{1,3}(?:,\d{3})*(?:\.\d+)?)', text)
    if match:
        return match.group(1).replace(",", "")
    return '0.00'

def detect_issue_date(text):
    date_range_pattern = r"(\d{2}/\d{2}/\d{4})\s*-\s*(\d{2}/\d{2}/\d{4})"

    matches = re.findall(date_range_pattern, text, re.IGNORECASE)
    if matches:
        try:
            start_date = datetime.strptime(matches[0][0], "%d/%m/%Y").strftime("%Y-%m-%d")
            end_date = datetime.strptime(matches[0][1], "%d/%m/%Y").strftime("%Y-%m-%d")
            print(f"Extracted Date: {start_date} to {end_date}")
            return start_date, end_date
        except ValueError as e:
            print(f"Date parsing error: {e}")
            return None
        
    print("No expiry date found in text") 
    return None

def detect_issuing_authority(text):
    """Detect the issuing authority from known vendors."""
    known_vendors = ["Safaricom Limited", "Microsoft", "Oracle", "Adobe", "IBM"]
    for vendor in known_vendors:
        if vendor.lower() in text.lower():
            return vendor
    return "Unknown"


def detect_expiry_date(text):
    date_range_pattern = r"(\d{2}/\d{2}/\d{4})\s*-\s*(\d{2}/\d{2}/\d{4})"
    # date_patterns = [
    #     r"Expiry\s*Date[:\s]*(\d{2}/\d{2}/\d{4})",
    #     r"Due\s*Date[:\s]*(\d{2}/\d{2}/\d{4})",
    #     r"(\d{2}/\d{2}/\d{4})"
    # ]

    matches = re.findall(date_range_pattern, text, re.IGNORECASE)
    if matches:
        try:
            start_date = datetime.strptime(matches[0][0], "%d/%m/%Y").strftime("%Y-%m-%d")
            end_date = datetime.strptime(matches[0][1], "%d/%m/%Y").strftime("%Y-%m-%d")
            print(f"Extracted Date: {start_date} to {end_date}")
            return start_date, end_date
        except ValueError as e:
            print(f"Date parsing error: {e}")
            return None
        
    print("No expiry date found in text")  # Debugging
    return None
        
    # for pattern in date_patterns:
    #     matches = re.findall(pattern, text, re.IGNORECASE)
    #     if matches:
    #         try:
    #             parsed_date = datetime.strptime(matches[0], "%d/%m/%Y").strftime("%Y-%m-%d")
    #             print(f"Extracted Expiry Date: {parsed_date}")  # Debugging
    #             return parsed_date
    #         except ValueError as e:
    #             print(f"Date parsing error: {e}")
    #             return None
    
   



@api_view(['POST'])
def upload_software(request):
    try:
        print("Received request to upload software license")
        
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"error": "No file provided"}, status=400)
        
        print("Uploaded file:", uploaded_file.name)

        
        file_path = default_storage.save(f"temp/{uuid.uuid4()}_{uploaded_file.name}", ContentFile(uploaded_file.read()))
        full_path = default_storage.path(file_path)
        print("Saved file at:", full_path)

       
        text = extract_text_from_pdf(full_path)
        print("Extracted text:", text[:500])
        

        if not text:
            return Response({"error": "No text extracted from file"}, status=400)

        # Detect license type
        type_license = detect_type_license(text)
        if not type_license:
            type_license = request.data.get("type_license")
            print("Detected:" ,type_license)
        
        name = detect_software_name(text)
        if not name:
            name = request.data.get("name")
            print("Detected:" ,name)
        
        kra_pin = detect_kra_pin(text)
        if kra_pin == "Unknown":
            kra_pin = request.data.get("kra_pin")
            print("KRA/PIN:" ,kra_pin)

        owner = detect_owner(text)
        if not owner:
            owner = request.data.get("owner")
            print("Detected:" ,owner)

        amount = detect_amount(text)
        if not amount:
            amount = request.data.get("amount")
            print("Detected:" ,amount)

        # Detect issuing authority
        issuing_authority = detect_issuing_authority(text)
        if issuing_authority == "Unknown":
            issuing_authority = request.data.get("issuing_authority")
            print("Vendor:" ,issuing_authority)


        issue_date = detect_issue_date(text)
        print("Issue date detected before saving:", issue_date)

        if not issue_date:
            issue_date = request.data.get("issue_date")

        print("Final issue_date before saving:", issue_date, type(issue_date))

        
        if issue_date:
            issue_date = issue_date[0] 
        else:
            return None 


        # Detect expiry date
        expiry_date = detect_expiry_date(text)
        print("Expiry date detected before saving:", expiry_date)

        if not expiry_date:
            expiry_date = request.data.get("expiry_date")

        print("Final expiry_date before saving:", expiry_date, type(expiry_date))

        
        if expiry_date:
            expiry_date = expiry_date[1] 
        else:
            expiry_date = "0001-01-01" 


       
        print(f"type_license: {type_license}")
        print(f"name: {name}")
        print(f"kra_pin: {kra_pin}")
        print(f"owner: {owner}")
        print(f"amount: {amount}")
        print(f"issuing_authority: {issuing_authority}")
        print(f"issue_date: {issue_date}")
        print(f"expiry_date: {expiry_date}")




        if not type_license or not name or not kra_pin or not owner or not amount or not issuing_authority or not issue_date or not expiry_date:
            return Response({"error": "Missing license details. Please provide manually."}, status=400)

        # Save data into SoftwareLicense table
        Software.objects.create(
            name=name,
            type_license=type_license,
            owner=owner,
            kra_pin=kra_pin,
            issuing_authority=issuing_authority,
            amount=amount,
            issue_date=issue_date,
            expiry_date=expiry_date,
            document=uploaded_file,
        )

        # Cleanup
        default_storage.delete(full_path)
        print("Temporary file deleted.")

        return Response({"message": "Successfully processed software license"}, status=200)

    except Exception as e:
        print("Unhandled error:", str(e))
        print("Traceback:", traceback.format_exc())
        return Response({"error": "Internal Server Error", "details": str(e)}, status=500)


@api_view(['GET'])
def list_software(request):
 
    licenses = Software.objects.all()
    serializer = SoftwareSerializer(licenses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_software(request, pk):
    try:
        license_obj = Software.objects.get(pk=pk)
        serializer = SoftwareSerializer(license_obj)
        return Response(serializer.data)
    except Software.DoesNotExist:
        return Response({"error": "Software License not found"}, status=404)


@api_view(['PUT', 'PATCH'])
def update_software(request, pk):
    license_obj = get_object_or_404(Software, pk=pk)
    serializer = SoftwareSerializer(license_obj, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_software(request, pk):
    try:
        license_obj = Software.objects.get(pk=pk)
        license_obj.delete()
        return Response({"message": "License deleted successfully"}, status=204)
    except Software.DoesNotExist:
        return Response({"error": "License not found"}, status=404)


@api_view(['POST'])
def trigger_email(request):
    try:
     send_software_reminder.delay()
    except Exception as e:
        print("Error occured: ", str(e))

    return Response({"massage": "Email Notification triggered!"}, status=200)

            # --- SOFTWARE --- #
class SoftwareViewSet(viewsets.ModelViewSet):
    queryset = Software.objects.all().prefetch_related('renew')
    serializer_class = SoftwareSerializer

    @action(detail=False, methods=["get"])
    def due_soon(self, request):
        upcoming_licenses = Software.objects.filter(expiry_date__lte=now().date())
        serializer = self.get_serializer(upcoming_licenses, many=True)
        return Response(serializer.data)
    
    def generate_pdf(self, request):
        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.drawString(100, 750, "Software License Report")
        
        licenses = Software.objects.all()
        y = 720
        for license in licenses:
            # Ensure you're converting model attributes to strings
            issuing_authority = str(license.issuing_authority)  # Convert to string
            license_type = str(license.type_license)  # Convert to string
            expiry_date = str(license.expiry_date)  # Convert to string
            pdf.drawString(100, y, f"{issuing_authority} {license_type} - Exp: {expiry_date}")
            y -= 20

        pdf.showPage()
        pdf.save()

        buffer.seek(0)
        return HttpResponse(buffer, content_type="application/pdf")

    @action(detail=False, methods=["get"])
    def generate_excel(self, request):
        licenses = Software.objects.all()
        data = [
            {
                "Name": l,
                "Issuing Authority": l.issuing_authority,
                "Type": l.type_license,
                "Expiry Date": l.expiry_date,
                "Status": "Active" if l.expiry_date >= datetime.today().date() else "Expired"
            }
            for l in licenses
        ]

        df = pd.DataFrame(data)
        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
            df.to_excel(writer, sheet_name="Licenses", index=False)

        buffer.seek(0)
        return HttpResponse(buffer, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


            # --- NOTIFICATION --- #
# class NotifyViewSet(viewsets.ModelViewSet):
#     queryset = Notify.objects.all()
#     serializer_class = NotifySerializer

@api_view(['GET'])
@permission_classes([AllowAny])  # This will make the endpoint accessible without authentication
def get_notifications(request):
    notifications = Notify.objects.all()  # No user profile filter
    serializer = NotifySerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notify.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({"message": "Notification marked as read"})
    except Notify.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)



        # --- RENEW --- #
class RenewSoftwareAPI(APIView):
    def put(self, request, pk, *args, **kwargs):
        try:
            license_obj = Software.objects.get(pk=pk)
            current_expiry_date = license_obj.expiry_date

           
            if not request.data.get("new_expiry_date"):
                new_expiry_date = current_expiry_date + timedelta(days=365)
            else:
                new_expiry_date = request.data.get("new_expiry_date")

            # Update the expiry date
            license_obj.expiry_date = new_expiry_date
            license_obj.save()

            return Response({"message": f"License renewed until {new_expiry_date}"}, status=status.HTTP_200_OK)

        except Software.DoesNotExist:
            return Response({"error": "Software License not found"}, status=status.HTTP_404_NOT_FOUND)

















###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                     ###---USECASE1---###
# def detect_license_type(text):
#     """Detect the type of license based on keywords."""
#     license_keywords = {
#         "DRIVING LICENSE": ["DRIVING LICENCE", "DRIVER'S LICENSE", "DRIVERS LICENSE"],
#         "BUSINESS LICENSE": ["SINGLE BUSINESS PERMIT", "BUSINESS LICENSE", "TRADE LICENSE"],
#         "SOFTWARE LICENSE": ["SOFTWARE LICENSE", "LICENSE AGREEMENT", "SOFTWARE USAGE AGREEMENT"],
#         "TOURISM LICENSE": ["TOURISM LICENCE"]
#     }
    
#     text = text.strip().upper()
#     best_match = max(((lt, fuzz.partial_ratio(kw.upper(), text)) for lt, kws in license_keywords.items() for kw in kws),
#                      key=lambda x: x[1], default=("unknown", 0))
    
#     return best_match[0] if best_match[1] > 50 else "unknown"

# # Extract text from PDF
# def extract_text_from_pdf(pdf_path):
#     """Extract text from a PDF file, with OCR for image-based PDFs."""
#     try:
#         doc = fitz.open(pdf_path)
#         text = ""

#         for page_num in range(doc.page_count):
#             page = doc.load_page(page_num)
#             page_text = page.get_text("text")

#             if page_text.strip():  
#                 text += page_text
#             else:
#                 print(f"No text found in page {page_num + 1}, attempting OCR...")
#                 pix = page.get_pixmap()
#                 img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
#                 ocr_text = pytesseract.image_to_string(img, config="--psm 6")  # Try improving OCR
#                 if ocr_text.strip():
#                     print(f"OCR found text on page {page_num + 1}")
#                 text += ocr_text

#         print(f"Extracted text from PDF (OCR included): {text[:1000]}")  # Print first 1000 chars for debugging
#         return text
#     except Exception as e:
#         print(f"Error extracting text from PDF: {e}")
#         return ""

# # Extract text from ODT
# def extract_text_from_odt(odt_path):
#     """Extract text from an ODT file."""
#     try:
#         doc = load(odt_path)
#         return "\n".join(str(p) for p in doc.getElementsByType(P))
#     except Exception as e:
#         print(f"Error extracting text from ODT: {e}")
#         return ""

# # Extract text from DOCX
# def extract_text_from_docx(docx_path):
#     """Extract text from a DOCX file."""
#     try:
#         doc = Document(docx_path)
#         return "\n".join(para.text for para in doc.paragraphs)
#     except Exception as e:
#         print(f"Error extracting text from DOCX: {e}")
#         return ""

# # Parsing driving license details
# def parse_license_details(text):
#     """Extract relevant details from a driving license text."""
#     holder_name, license_number, national_id, expiry_date = None, None, None, None
    
#     name_match = re.search(r"Surname\s*(\w+)\s*Other\s*Names\s*([\w\s]+)", text)
#     if name_match:
#         holder_name = f"{name_match.group(1).strip()} {name_match.group(2).strip()}"
    
#     national_id_match = re.search(r"National ID No:\s*(\S+)", text)
#     if national_id_match:
#         national_id = national_id_match.group(1).strip()
    
#     license_number_match = re.search(r"Licence No:\s*(\S+)", text)
#     if license_number_match:
#         license_number = license_number_match.group(1).strip()
    
#     expiry_date_match = re.search(r"Date of Expiry\s+(\d{2}\s+[a-zA-Z]+\s+\d{4})", text, re.DOTALL)
#     if expiry_date_match:
#         try:
#             expiry_date = parser.parse(expiry_date_match.group(1).strip(), fuzzy=True).date()
#         except ValueError:
#             expiry_date = None
    
#     return holder_name, license_number, national_id, expiry_date

# # Parsing business license details
# def parse_business_license_details(text):
#     """Extracts key details from a business license document."""
#     business_name, license_number, expiry_date = None, None, None

#     details = {}

#     business_name_match = re.search(r"Applicant/Business/Commercial Name[:\s]*([\w\s]+)", text, re.DOTALL)
#     if business_name_match:
#         details["holder_name"] = business_name_match.group(1).strip()
#     else:
#         print("Business name not found.")

#     license_number_match = re.search(r"Business ID[:\s]*([\w\d-]+)", text, re.DOTALL)
#     if license_number_match:
#         details["license_number"] = license_number_match.group(1).strip()
#     else:
#         print("License number not found.")
    
#     issue_date_match = re.search(r"Date of Issue[:\s]*(\d{2}\s+[a-zA-Z]+\s+\d{4})", text, re.DOTALL)
#     if issue_date_match:
#         details["issue_date"] = datetime.strptime(issue_date_match.group(1).strip(), "%d %B %Y").date()
#     else:
#         print("Issue date not found.")

#     return details["holder_name"], details["license_number"], details["issue_date"]

# # Parsing tourism license details
# def parse_tourism_license_details(text):
#     tourism_name, license_number, expiry_date = None, None, None

#     details = {}

#     tourism_name_match = re.search(r"LICENCE is hereby granted to[:\s]*([\w\s]+)", text)
#     if tourism_name_match:
#         details["tourism_name"] = tourism_name_match.group(1).strip()
#     else:
#         print("Tourism name not found.")

#     license_number_match = re.search(r"Licence No.[:\s]*([\w\d-]+)", text)
#     if license_number_match:
#         details["license_number"] = license_number_match.group(1).strip()
#     else:
#         print("Tourism license number not found.")

#     expiry_date_match = re.search(r"Expiry Date[:\s]*(\d{2}\s+[a-zA-Z]+\s+\d{4})", text)
#     if expiry_date_match:
#         details["expiry_date"] = datetime.strptime(expiry_date_match.group(1).strip(), "%d %B %Y").date()
#     else:
#         print("Tourism expiry date not found.")

#     return details["tourism_name"], details["license_number"], details["expiry_date"]

# @api_view(['POST'])
# def upload_license(request, license_type):
#     try:
#         print("Received request to upload license")
        
#         uploaded_file = request.FILES.get("my_file")
#         if not uploaded_file:
#             return Response({"error": "No file provided"}, status=400)
        
#         print("Uploaded file:", uploaded_file.name)

#         # Save file temporarily
#         file_path = default_storage.save(f"temp/{uuid.uuid4()}_{uploaded_file.name}", ContentFile(uploaded_file.read()))
#         full_path = default_storage.path(file_path)
#         print("Saved file at:", full_path)

#         # Detect file type
#         file_type = uploaded_file.content_type
#         print("File type detected:", file_type)

#         # Extract text
#         text = ""
#         if file_type == 'application/pdf':
#             print("Extracting text from PDF...")
#             text = extract_text_from_pdf(full_path)
#         elif file_type == 'application/vnd.oasis.opendocument.text':
#             print("Extracting text from ODT...")
#             text = extract_text_from_odt(full_path)
#         elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
#             print("Extracting text from DOCX...")
#             text = extract_text_from_docx(full_path)
#         else:
#             return Response({"error": "Unsupported file format"}, status=400)

#         print(f"Extracted text (full): {text[:1000]}")  # Print first 1000 characters for debugging
#         if not text:
#             return Response({"error": "No text extracted from file"}, status=400)

#         # Detect license type
#         detected_license_type = detect_license_type(text)
#         print("Detected license type:", detected_license_type)

#         # Extract details based on detected license type
#         if detected_license_type == "DRIVING LICENSE":
#             holder_name, license_number, national_id, expiry_date = parse_license_details(text)
#             print("Parsed details:", holder_name, license_number, national_id, expiry_date)

#             if not all([holder_name, license_number, national_id, expiry_date]):
#                 return Response({"error": "Missing license details"}, status=400)

#             # Save to database
#             License.objects.create(
#                 license_type=detected_license_type,
#                 holder_name=holder_name,
#                 license_number=license_number,
#                 national_id=national_id,
#                 expiry_date=expiry_date,
#             )
            
#         elif detected_license_type == "BUSINESS LICENSE":
#             business_name, license_number, issue_date = parse_business_license_details(text)

#             if not all([business_name, license_number, issue_date]):
#                 return Response({"error": "Missing business license details"}, status=400)

#             License.objects.create(
#                 license_type=detected_license_type,
#                 holder_name=business_name,
#                 license_number=license_number,
#                 national_id=None,
#                 issue_date=issue_date,
#             )

#         elif detected_license_type == "TOURISM LICENSE":
#             tourism_name, license_number, expiry_date = parse_tourism_license_details(text)

#             if not all ([tourism_name, license_number, expiry_date]):
#                 return Response({"error": "Missing tourism license details"}, status=400)

#             License.objects.create(
#                 license_type=detected_license_type,
#                 holder_name=tourism_name,
#                 license_number=license_number,
#                 expiry_date=expiry_date,
#             )

#         # Cleanup
#         default_storage.delete(full_path)
#         print("Temporary file deleted.")

#         return Response({"message": "Successfully processed license"}, status=200)

#     except Exception as e:
#         print("Unhandled error:", str(e))
#         return Response({"error": "Internal Server Error", "details": str(e)}, status=500)

        
#         # Block3: Extract Text from PDF
#         # if is_text_pdf:
#         #     if uploaded_file.page_count > 0:
#         #         for page_num in range(uploaded_file.page_count):
#         #             page = uploaded_file.load_page(page_num)
#         #             page_text = page.get_text("text")
#         #             text += page_text
#         #             print(f"Extracted text from page {page_num + 1}")
#         #     else:
#         #         return HttpResponseBadRequest("No pages found in the PDF.")
        
#         # else:
#         #     # Block4 Image-based PDF
#         #     return("The PDF is Image Based, we cannot extract information")

#         # # Block5: License Type Detection
#         # detected_license_type = ""

#         # text_upper = text.upper()

#         # if "DRIVING LICENCE" in text_upper:
#         #     detected_license_type = "driving_license"
#         # elif "SINGLE BUSINESS PERMIT" in text_upper:
#         #     detected_license_type = "business_license"
#         # elif "TOURISM LICENCE" in text_upper:
#         #     detected_license_type = "tourism_license"
        
#         # print(f"Block5: License type detected: {license_type}")
        
#         # if not detected_license_type:
#         #     print("Block5: License type not detected, returning early.")
#         #     return HttpResponseBadRequest('Results not matching')

#         # # Block6: Create License Record
#         # if license_type == "driving_license":
#         #     holder_name, license_number, national_id = None, None, None

#         #     holder_name_match = re.search(r"Surname\s*([\w\s]+)\s*Other\s*Names\s*([\w\s]+)", text, re.DOTALL)

#         #     if holder_name_match:
#         #         surname = holder_name_match.group(1).strip()
#         #         other_names = holder_name_match.group(2).strip()

#         #         holder_name = f"{surname} {other_names}"
#         #         clean_name = re.sub(r"\nDate of Birth\n\d{4}", "", holder_name)

#         #         print("Holder Name:", clean_name) 

#         #     else:
#         #         print("Names not foumd")
            
#         #     date_birth_match = re.search(r"Date of Birth\s*(\S+)([\w\s]+)", text)
#         #     if date_birth_match:
#         #         date_birth = date_birth_match.group(1).strip()
#         #         print("D.O.B:", date_birth)
#         #         formatted_dob=datetime.strptime(date_birth, '%Y-%m-%d').date()
#         #         print("Formatted_dob:", formatted_dob)
            

#         #     gender_match = re.search(r"Sex\s*(\S+)([\w\s]+)", text)
#         #     if gender_match:
#         #         gender = gender_match.group(1).strip()
#         #         print("Gender:", gender)
            
#         #     national_id_match = re.search(r"National ID No:\s*(\S+)", text)
#         #     if national_id_match:
#         #         national_id = national_id_match.group(1).strip()
#         #         print("National ID:", national_id)

#         #     license_number_match = re.search(r"Licence No:\s*(\S+)", text)
#         #     if license_number_match:
#         #         license_number = license_number_match.group(1).strip()
#         #         print("License Number:", license_number)

#         #     issue_date_match = re.search(r"Date of Issue/Renewal\s+(\d{2}\s+[a-zA-Z]+\s+\d{4})", text.replace("\n", " "))
#         #     if issue_date_match:
#         #         full_date = issue_date_match.group(1).strip()
#         #         print("Issue Date:", full_date)
#         #         formatted_issue=datetime.strptime(full_date, '%d %B %Y').date()
#         #         print("formatted_issue:", formatted_issue)

#         #     expiry_date_match = re.search(r"Date of Expiry\s+(\d{2}\s+[a-zA-Z]+\s+\d{4})", text, re.DOTALL)
#         #     if expiry_date_match:
#         #         expiry_date = expiry_date_match.group(1).strip()
#         #         date_value = re.sub(r"\s+", " ", expiry_date)
#         #         print("Expiry Date:", date_value)
#         #         formatted_expiry=datetime.strptime(expiry_date, '%d %B %Y').date()
#         #         print("formatted_expiry:", formatted_expiry)
            
#         #     vehicle_category_pattern = r"CATEGORIES OF VEHICLES\s*([A-Za-z0-9\s]+)\s*DATE OF ISSUE\s*(\d{2}\s+[a-zA-Z]+\s+\d{4})\s*DATE OF EXPIRY\s*(\d{2}\s+[a-zA-Z]+\s+\d{4})"
#         #     vehicle_category_matches = re.findall(vehicle_category_pattern, text)

#         #     if vehicle_category_matches:
#         #         for category, issue_date, expiry_date in vehicle_category_matches:
#         #             vehicle_category = category.strip()
#         #             print(f"Vehicle Category: {vehicle_category}")

#         #     if holder_name and license_number and national_id:

#         #         try:
#         #             License.objects.create(
#         #             license_type=license_type,
#         #             holder_email=holder_email,
#         #             holder_name=holder_name, 
#         #             license_number=license_number,  
#         #             national_id=national_id,
#         #             gender=gender,
#         #             date_birth=formatted_dob,
#         #             issue_date=formatted_issue,
#         #             expiry_date=formatted_expiry,
                    
#         #             )

#         #         except Exception as e:
#         #             return HttpResponseBadRequest("Missing information for license already save")

#         #     else:
#         #         print(f"Block6: Saving license data: {holder_name}, {license_number}, {national_id}")
#         #         return HttpResponseBadRequest("Missing information for license creation")
        
#         # Block7: Clean-up and success
#     uploaded_file.close() 
#     default_storage.delete(file_path)
#         # with open('path_to_file', 'rb') as f:
#             # Your file operations here
#             # content = f.read()

#         # File is automatically closed after this block
#             # f.close()

#     # TOURISM
#     # BUSINESS
# # except Exception as e:
# #     return JsonResponse({'error': 'Invalid request', 'details': str(e)})

# #     print("Block7: File processing completed, and file deleted.")
    
# #     return HttpResponse("File has been uploaded and processed successfully")

# # STORE
# @api_view(http_method_names=['POST'])
# def store_license(request):

#     uploaded_file = request.FILES.get('my_file')
#     if not uploaded_file:
#         return HttpResponseBadRequest("No file provided.")
    
#     if not uploaded_file.name.endswith('.pdf'):
#         return HttpResponseBadRequest("Invalid file format. Please upload a PDF file.")
    
#     file_path = default_storage.save(f"temp/{uploaded_file.name}", ContentFile(uploaded_file.read()))
    
#     try:
#         with fitz.open(default_storage.path(file_path)) as doc:
#             pdf_text = "\n".join([page.get_text("text") for page in doc])
        
#         detected_license_type = detected_license_type(pdf_text)
#         extracted_data = extracted_data(pdf_text, detected_license_type)
#         extracted_data["document"] = uploaded_file # Store file reference
        
#         if not extracted_data:
#             return HttpResponseBadRequest("Could not extract necessary information from the file.")
        
#         serializer = LicenseSerializer(data={"license_type": detected_license_type, **extracted_data})
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse({"message": "License stored successfully", "license_id": serializer.data["id"]})
#         else:
#             return JsonResponse(serializer.errors, status=400)
        
#     except Exception as e:
#         return JsonResponse({'error': 'Invalid request', 'details': str(e)})
    
#     finally:
#         default_storage.delete(file_path)  # Cleanup

# # RETRIEVE
# @api_view(['GET'])
# def retrieve_license(request, param_id):
#     print("Retrieve1")

#     licenses = License.objects.filter(national_id=param_id)

#     if not licenses.exists():
#         licenses = License.objects.filter(license_number=param_id)
        
#     if not licenses.exists():
#         return JsonResponse({'error': 'Nothing detected'})
    
#     license_data = list(licenses.values(
#                 'holder_name', 'holder_email', 'issue_date', 'expiry_date', 'gender',
#                 'national_id', 'license_number', 'license_type', 'date_birth'
#             ))

#     return JsonResponse({'licenses': license_data}, safe=False)

# # UPDATE LICENSE RECORDS
# @api_view(['PATCH'])
# def update_license(request, license_type, license_number):
#     print("UPDATE1")

#     #Tries to retrieve from the license object
#     license = get_object_or_404(License, license_type=license_type, license_number=license_number)
#     print("UPDATE2")


#     serializer = LicenseSerializer(License.objects, data=request.data, partial=True)
#     print("UPDATE3")

#     if serializer.is_valid():
#         print("UPDATE4")

#         serializer.save()
#         print("UPDATE5")

#         return JsonResponse({"message": "License updated successfull"})

# # ADD LICENSE RECORDS
# @api_view(['POST'])
# def add_license(request):


#     license_number = request.data.get('license_number')
#     if license_number and License.objects.filter(license_number=license_number).exists():
  
#         if request.method == 'POST':
#             serializer = LicenseSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data)
#             return Response(serializer.errors)

# # EDIT
# @api_view(['PUT'])
# def edit_license(request, license_number):
#     print("EDIT1")
#     try:
#         license = License.objects.get(license_number='PHD106')
#         print("EDIT2")
#     except License.DoesNotExist:
#         print("EDIT3")
#         return Response({'error': 'License not found'})
#         print("EDIT4")

#     if request.method == 'PUT':
#         print("EDIT5")
#         serializer = LicenseSerializer(license, data=request.data)
#         print("EDIT6")
#         if serializer.is_valid():
#             print("Valid")
#             serializer.save()
#             print("EDIT7")
#             return Response(serializer.data)
#         return Response(serializer.errors)

# # DELETE
# @api_view(['DELETE'])
# def delete_license(request, license_number):
#     print("DEL1")

#     try:
#         license = License.objects.get(license_number=license_number)
#         print("DEL2")
#     except License.DoesNotExist:
#         print("DEL3")
#         return Response({'error': 'License not found'})

#     if request.method == 'DELETE':
#         print("DEL4")
#         license.delete()
#         print("DEL5")
#         return Response({'message': 'License deleted successfully'})
        
    

# @api_view(["POST"])
# def trigger_license_reminders(request):
#     print("View 1 request")

#     send_renewal_reminder.delay()

#     return Response({"message": "License renewal reminders are being processed."})



# # REPORTS
# class LicenseReport(APIView):
#     def get(self, request):
#         licenses = License.objects.all()
#         serializer = LicenseSerializer(licenses, many=True)
#         return Response(serializer.data)
    
# # SENDS EXPIRY TO FRONTEND
# def get_renewals(request):
#     renewals = License.objects.all().values('expiry_date', 'notifications')
#     return JsonResponse(list(renewals), safe=False) 


# # Notification

# class Notification(APIView):
#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         print(self.request.user)
#         notifications = Notification.objects.filter(user=request.user).order_by('-notification_date')
        
#         print("Authenticated user:", request.user)
#         print("Notifications:", notifications)
        
#         serializer = self.serializer_class(notifications, many=True)
#         return Response(serializer.data)


# # API ViewSet
# class LicenseViewSet(viewsets.ModelViewSet):
#         queryset = License.objects.all()
#         serializer_class = LicenseSerializer


# # API SAVE
# class LicenseView(APIView):
#     def get(self, request):
#         licenses = License.objects.all()
#         serializer = LicenseSerializer(licenses, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = LicenseSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):
#         license = License.objects.get(pk=pk)
#         serializer = LicenseSerializer(license, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# # RENEW API ENDPOINT
# class RenewLicenseView(APIView):
#     def post(self, request, license_id):
#         try:
#             license_obj = License.objects.get(id=license_id)
#             license_obj.update_renewal()
#             return Response({"message": "License renewed successfully"}, status=status.HTTP_200_OK)
#         except License.DoesNotExist:
#             return Response({"error": "License not found"}, status=status.HTTP_404_NOT_FOUND)