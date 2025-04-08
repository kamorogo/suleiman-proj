from celery import shared_task
from django.core.mail import send_mail
import traceback
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils.timezone import now
from .models import Subscription


                ######---USECASE2---#####
@shared_task
def send_software_reminder():

    print("Starting...")

    try:
        print("Sending")
        today = now().date()
        print("Sent")

        for days in [30, 15, 7]:
            reminder_date = today + timedelta(days=days)
            expiring_licenses = Subscription.objects.filter(expiry_date=reminder_date)
            print(f"Found {expiring_licenses.count()} expiring licenses for {reminder_date}")


            
            for license_obj in expiring_licenses:
                if getattr(license_obj, 'users', None) and getattr(license_obj.users, 'email', None):

                    subject = f"Reminder: Your {license_obj.subscription_type} License Expires Soon"
                    message = f"""
                    Dear Customer,

                    Your software license for {license_obj.providers.service_provider} is set to expire on {license_obj.expiry_date}.
                    Please renew it to avoid stress and other delays.

                    Thank you,
                    ABC Bank Group
                    """

                    send_mail(
                        subject,
                        message,
                        from_email="alisuleimann4@gmail.com",
                        recipient_list=[license_obj.users.email],
                        fail_silently=False
                    )

        return "Notification Emails Sent!"
    
    except Exception as e:

        traceback.print_exc()
    
        return str(e)



