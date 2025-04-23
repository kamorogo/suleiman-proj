from celery import shared_task
from django.core.mail import send_mail
import traceback
# from django.contrib.auth.models import User
from datetime import timedelta
from django.utils.timezone import now
from .models import Subscription, Users


@shared_task
def send_software_reminder():   

    print("Starting...")

    try:
        print("Sending")
        today = now().date()
        alert_days = [30, 15, 7]
        print("Sent")

        for days in alert_days:
            reminder_date = today + timedelta(days=days)
            expiring_licenses = Subscription.objects.filter(expiry_date=reminder_date)

            print(f"Found {expiring_licenses.count()} expiring licenses for {reminder_date}")


            
            for license_obj in expiring_licenses:
                if getattr(license_obj, 'users', None) and getattr(license_obj.Users, 'email', None):

                    subject = f"Reminder: Your {license_obj.subscription_type} License Expires Soon"
                    message = f"""
                    Dear Customer,\n\n

                    Your software license for {license_obj.providers.service_provider} is set to expire on {license_obj.expiry_date}.
                    Please renew it to avoid stress and other delays.\n\n

                    Thank you,\n
                    ABC Bank Group
                    """

                    send_mail(subject, message, "no-reply@example.com", [license_obj.Users.email], fail_silently=False)

                    print(f"✅ Email sent to {license_obj.Users.email}")

        return "Notification Emails Sent!"
    
    except Exception as e:

        traceback.print_exc()
    
        return str(e)



