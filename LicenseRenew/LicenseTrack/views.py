
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LicenseRenew.settings')

import re
from io import BytesIO
import traceback
import random
import sys
from django.conf import settings
from django.core.mail import send_mail
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
import fitz
import uuid
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed, ValidationError
import pytesseract
from PIL import Image
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from fuzzywuzzy import fuzz
from dateutil import parser
# from docx import Document
from django.db import transaction
from django.db.models import Count, Sum, Q
from odf.opendocument import load 
from odf.text import P
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from pdf2image import convert_from_path
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, FileResponse
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, APIView, parser_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import SubscriptionSerializer, SignUpSerializer, SignInSerializer, User_ProfileSerializer
from .models import Subscription, Providers, Users, User_Profile,OTP
from .tasks import send_software_reminder
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from django.utils.timezone import now
from django.utils import timezone
import io
from django.contrib.auth import authenticate
from datetime import date, timedelta
import pandas as pd
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework.permissions import AllowAny
import uuid


def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file (OCR for images)."""
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""

    for page in doc:
        page_text = page.get_text("text")
        if page_text.strip():
            text += page_text
        else:
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            text += pytesseract.image_to_string(img)

    return text.strip()

def parse_license_details(text):
    """Extract structured license details from the text."""
    details = {}

    # Extract Service Provider
    providers = ["Microsoft", "Google", "Oracle", "Adobe"]
    for provider in providers:
        if provider.lower() in text.lower():
            details["service_provider"] = provider
            break

    # Extract Amount Paid (Currency format)
    match = re.search(r"Total\s*Ksh\.(\d{1,3}(?:,\d{3})*(?:\.\d+)?)", text)
    details["amount_paid"] = match.group(1).replace(",", "") if match else "0.00"

    # Extract Date Range (Issue & Expiry Date)
    date_match = re.search(r"(\d{2}/\d{2}/\d{4})\s*-\s*(\d{2}/\d{2}/\d{4})", text)
    if date_match:
        try:
            issue_date = datetime.strptime(date_match.group(1), "%d/%m/%Y")
            expiry_date = datetime.strptime(date_match.group(2), "%d/%m/%Y")
            details["issue_date"] = issue_date.strftime("%Y-%m-%d")
            details["expiry_date"] = expiry_date.strftime("%Y-%m-%d")
            details["duration"] = (expiry_date - issue_date).days // 30
        except ValueError:
            pass

    return details


@api_view(["POST"])
def extract_text(request):
    if request.method == "POST":
        document = request.FILES.get("document")

        if not document:
            return JsonResponse({"error": "No document provided"}, status=400)

        text = extract_text_from_pdf(document)
        extracted_data = parse_license_details(text)

        return JsonResponse(extracted_data)

    return JsonResponse({"error": "Invalid request method"}, status=405)


class CreateLicense(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Auth user:", request.user) 
        print("Is Authenticated:", request.user.is_authenticated)

        user_instance = request.user

        document = request.FILES.get("document")
        data = request.data
        extracted_data = {}

        if document:
            try:
                text = extract_text_from_pdf(document)
                extracted_data = parse_license_details(text)
                print("Extracted Data:", extracted_data)
            except Exception as e:
                return Response({"detail": f"Error extracting data from document: {str(e)}"}, status=400)

        subscription_type = extracted_data.get("subscription_type", data.get("subscription_type"))
        service_provider = extracted_data.get("service_provider", data.get("service_provider"))
        amount_paid = extracted_data.get("amount_paid", data.get("amount_paid"))
        duration = extracted_data.get("duration", data.get("duration"))
        issue_date = extracted_data.get("issue_date", data.get("issue_date"))
        expiry_date = extracted_data.get("expiry_date", data.get("expiry_date"))

        DURATION_TYPE_MAP = {
            0: "Trial",
            1: "Monthly",
            3: "Quarterly",
            6: "Semi-Annual",
            12: "Annual",
            24: "Biennial",
            36: "Triennial",
            48: "Quadrennial"
        }

        if not subscription_type and duration is not None:
            try:
                subscription_type = DURATION_TYPE_MAP.get(int(duration), f"{duration} Months")
            except ValueError:
                pass

        if not all([subscription_type, service_provider, amount_paid, duration, issue_date, expiry_date]):
            return Response({"detail": "Missing required fields"}, status=400)

        provider_instance, created = Providers.objects.get_or_create(service_provider=service_provider, defaults={
            "address": "Unknown Address",
            "description": "Subscription service provider/vendor"
        })

        license_instance = Subscription.objects.create(
            users=user_instance,
            providers=provider_instance,
            subscription_type=subscription_type,
            amount_paid=amount_paid,
            duration=duration,
            issue_date=issue_date,
            expiry_date=expiry_date,
            document=document if document else None,
        )


        return Response({"message": "License created successfully", "license_id": license_instance.id})



class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().select_related('user') 
    serializer_class = SubscriptionSerializer

@api_view(['GET'])
def list_software(request):
    licenses = Subscription.objects.all()
    serializer = SubscriptionSerializer(licenses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_software(request, id):
    try:
        license_obj = Subscription.objects.get(id=id)
        serializer = SubscriptionSerializer(license_obj)
        return Response(serializer.data)
    except Subscription.DoesNotExist:
        return Response({"error": "Software License not found"}, status=404)

# ----DELETE--- #
@api_view(['DELETE'])
def delete_software(request, id):
    try:
        license_obj = Subscription.objects.get(id=id)
        license_obj.delete()
        return Response({"message": "License deleted successfully"}, status=204)
    except Subscription.DoesNotExist:
        return Response({"error": "License not found"}, status=404)
    
@api_view(['POST'])
def trigger_email(request):

    try:
     print("Sending Email")
     send_software_reminder.delay()
     print("Email Sent")
     return Response({"message": "Email Notification triggered!"}, status=200)

    except Exception as e:
        print("Error occured: ", str(e))

        return Response({"error": str(e)}, status=500)

# ----DOWNLOAD---- #
def download_subscription(request, id):
    subscription = get_object_or_404(Subscription, id=id)

    if subscription.document:
        return FileResponse(subscription.document.open(), as_attachment=True)
    return HttpResponseNotFound("File not found")



# ----EDIT/UPDATE---- #
class LicenseUpdateView(APIView):
    def put(self, request, id):
        try:
            license = Subscription.objects.get(id=id)
            print(f"License Found: {license}")
        except Subscription.DoesNotExist:
            return Response({'error': 'License not found'}, status=status.HTTP_404_NOT_FOUND)

        print("Request Data:", request.data) 

        serializer = SubscriptionSerializer(license, data=request.data, partial=True)

        if serializer.is_valid():
            print("Data availed:", serializer.validated_data)

            serializer.save()
            print("Subscription saved:")

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print("Validation failed:", serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----REPORTS---- #
class SubscriptionReportAPIView(APIView):

    def get(self, request):
        data = Subscription.objects.aggregate(
            total_subscriptions=Count('id'),
            active_subscriptions=Count('id', filter=Q(expiry_date__gte=now().date())),
            expired_subscriptions=Count('id', filter=Q(expiry_date__lt=now().date())),
            total_revenue=Sum('amount_paid')
        )

        return Response(data)

class SubscriptionTypeReportAPIView(APIView):

    def get(self, request):
        data = Subscription.objects.values('subscription_type').annotate(
            count=Count('id'),
            revenue=Sum('amount_paid')
        )
        return Response({"subscription_types": list(data)})

class ProvidersListAPIView(APIView):

    def get(self, request):
        providers = Providers.objects.values("id", "service_provider")
        return Response({"providers": list(providers)})

class SubscriptionDataAPIView(APIView):

    def get(self, request):
        data = Subscription.objects.values(
            "providers__service_provider",
            "subscription_type",
            "amount_paid",
            "issue_date",
            "expiry_date"
        )
        return Response({"list": list(data)})
    

def generate_pdf_report(request):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)

    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, 780, "Subscription Report")

    subscriptions = Subscription.objects.all()
    y = 740
    p.setFont("Helvetica", 10)
    for sub in subscriptions[:40]:
        line = f"{sub.providers.service_provider if sub.providers else 'N/A'} | " \
               f"{sub.subscription_type if sub.subscription_type else 'N/A'} | " \
               f"Kshs.{sub.amount_paid} | {sub.issue_date} - {sub.expiry_date} | {sub.status}"
        p.drawString(60, y, line)
        y -= 15
        if y < 60:
            p.showPage()
            y = 750

    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="subscription_report.pdf")

def generate_excel_report(request):

    subscriptions = Subscription.objects.select_related("providers", "subscription_type").all()

    data = []
    for sub in subscriptions:
        data.append({
            "Provider": sub.providers.service_provider if sub.providers else "N/A",
            "Subscription Type": sub.subscription_type if sub.subscription_type else "N/A",
            "Amount Paid (Kshs)": sub.amount_paid,
            "Issue Date": sub.issue_date.strftime("%Y-%m-%d") if sub.issue_date else "N/A",
            "Expiry Date": sub.expiry_date.strftime("%Y-%m-%d") if sub.expiry_date else "N/A",
            "Status": sub.status,
        })

    df = pd.DataFrame(data)

    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Subscriptions")
        worksheet = writer.sheets["Subscriptions"]
        for i, col in enumerate(df.columns):
            column_width = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.set_column(i, i, column_width)

    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="subscription_report.xlsx")
    
def generate_report(request, format):
    if format == 'pdf':
        return generate_pdf_report(request)
    elif format == 'excel':
        return generate_excel_report(request)
    else:
        return HttpResponseBadRequest("Unsupported format")


# ----USER MANAGEMENT---- #
class SignUpView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            print("Received Data:", data) 
           
            required_fields = ["username", "password", "first_name", "middle_name", "last_name", "email"]
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({"error": f"{field} is required"}, status=400)


            user = Users(
                username=data["username"],
                first_name=data["first_name"],
                middle_name=data.get("middle_name", ""), 
                last_name=data["last_name"],
                phone_number=data.get("phone_number"),
                email=data["email"]
            )
            user.set_password(data["password"]) 
            user.save()

            print(f"User {user.username} saved successfully!")

            return JsonResponse({"message": "User created successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
       
        except Exception as e:   

            print(f"Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
       
class SignInView(APIView):
    def post(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        print(f"Attempting to authenticate user: {username_or_email}")

        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        try:
            if re.match(email_pattern, username_or_email):
                
                user = get_user_model().objects.get(email=username_or_email)
            else:
               
                user = get_user_model().objects.get(username=username_or_email)
            
            print(f"User found: {user}")

            if user.check_password(password):
                print("Password is correct")

                
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({'message': 'Authenticated successfully', 'access_token': access_token}, status=200)
            else:
                print("Password is incorrect")
                raise AuthenticationFailed('Invalid credentials')
        except Users.DoesNotExist:
            print(f"User with username {username_or_email} does not exist")
            raise AuthenticationFailed('User does not exist')
        

class SignOutView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist() 

            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# ----LOGGED USER---- #
class LoggedUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "name": user.username,
            "email": user.email,
        })
    
# ----PASSWORD LOGIC---- #
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = Users.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_link = f"http://127.0.0.1:3000/reset_password/{uid}/{token}/"

            send_mail(
                subject="Reset Your Password",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("password")  
        try:
            
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(id=uid)

         
            if PasswordResetTokenGenerator().check_token(user, token):
                user.set_password(password)  
                user.save()  
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        except (get_user_model().DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)


# ----SUBCSRIPTION STATUS---- #
def subscription_status(request, id):

    subscription = Subscription.objects.get(id=id)

    current_date = timezone.now().date()

    if subscription.expiry_date < current_date:
        subscription.status = 'active'

    elif subscription.transitioning_to_another_provider:
        subscription.status = 'decommissioned'

    else:
        subscription.status = 'active'

    
    subscription.save()

    return render(request, 'subscription_status.html', {'subscription': subscription})


# ----USER PROFILE---- #
class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
   

    def get(self, request):
        print("Authorization Header:", request.headers.get('Authorization'))
        print("User:", request.user)
        print("Is Authenticated:", request.user.is_authenticated)
        
        if not request.user.is_authenticated:
            return Response({"detail": "Not authenticated"}, status=403)

        try:
            profile, created = User_Profile.objects.get_or_create(user=request.user)
            print("Matched Profile:", request.user)
        except Exception as e:
            print("Profile fetch error:", e)
            return Response({"detail": str(e)}, status=404)

        serializer = User_ProfileSerializer(profile)
        return Response(serializer.data, status=200)

    def put(self, request):
        profile = get_object_or_404(User_Profile, user=request.user)
        user_data = request.data.get('user', None)

        serializer = User_ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()  

            if user_data:
                updated = False
                user = request.user

                if 'first_name' in user_data and user.first_name != user_data['first_name']:
                    user.first_name = user_data['first_name']
                    updated = True
                if 'last_name' in user_data and user.last_name != user_data['last_name']:
                    user.last_name = user_data['last_name']
                    updated = True
                if 'middle_name' in user_data and hasattr(user, 'middle_name') and user.middle_name != user_data['middle_name']:
                    user.middle_name = user_data['middle_name']
                    updated = True
                if 'email' in user_data and user.email != user_data['email']:
                    user.email = user_data['email']
                    updated = True
                if 'phone_number' in user_data and user.phone_number != user_data['phone_number']:
                    user.phone_number = user_data['phone_number']
                    updated = True

                if updated:
                    user.save()

            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)




# ----RENEW---- #
@api_view(['POST'])
@parser_classes([MultiPartParser])
def renew_subscription(request, id):
    license = Subscription.objects.get(id=id)

    new_expiry = request.data.get('new_expiry_date')
    subscription_type = request.data.get('subscription_type')
    provider = request.data.get('provider')
    notes = request.data.get('notes')
    renewal_document = request.FILES.get('renewal_document')

    try:
        license.expiry_date = new_expiry
        license.status = 'active'
        license.subscription_type = subscription_type
        license.provider = provider
        license.notes = notes
        if renewal_document:
            license.renewal_document = renewal_document  
        license.save()
        return Response({"message": "License renewed."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
