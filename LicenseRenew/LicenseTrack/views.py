#Env Import
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LicenseRenew.settings')

import re
import traceback
import sys
from django.conf import settings
from django.core.mail import send_mail
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
import fitz
import uuid
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
import pytesseract
from PIL import Image
from django.contrib.auth.hashers import make_password
from fuzzywuzzy import fuzz
from dateutil import parser
from docx import Document
from django.db.models import Count, Sum, Q
from odf.opendocument import load 
from odf.text import P
from pdf2image import convert_from_path
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, FileResponse
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, APIView, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import SubscriptionSerializer, SignUpSerializer, SignInSerializer
from .models import Subscription, Providers, Users
from .tasks import send_software_reminder
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from django.utils.timezone import now
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

    # Extract Subscription Type
    subscription_types = ["Proprietary", "Enterprise"]
    for sub in subscription_types:
        if sub.lower() in text.lower():
            details["subscription_type"] = sub
            break

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
     print("Enail Sent")
     return Response({"message": "Email Notification triggered!"}, status=200)

    except Exception as e:
        print("Error occured: ", str(e))

        return Response({"error": str(e)}, status=500)

# ----DOWNLOAD---- #
def download_subscription (request, id):
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



# ----USER MANAGEMENT---- #
class SignUpView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            print("Received Data:", data) 
           
            required_fields = ["username", "password", "name", "email"]
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({"error": f"{field} is required"}, status=400)


            user = Users(
                username=data["username"],
                name=data["name"],
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
        username = request.data.get('username')
        password = request.data.get('password')

        print(f"Attempting to authenticate user: {username}")
        try:
            user = Users.objects.get(username=username)
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
            print(f"User with username {username} does not exist")
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


# ----USER PROFILE---- #
# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
       
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#         except UserProfile.DoesNotExist:
#             return Response({"detail": "Profile not found"}, status=404)

#         serializer = UserProfileSerializer(profile)
#         return Response(serializer.data)

#     def put(self, request):
       
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#         except UserProfile.DoesNotExist:
#             return Response({"detail": "Profile not found"}, status=404)

#         serializer = UserProfileSerializer(profile, data=request.data, partial=True)

#         if serializer.is_valid():
#             updated_profile = serializer.save()
#             return Response(UserProfileSerializer(updated_profile).data)

#         return Response(serializer.errors, status=400)