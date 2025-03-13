from celery import shared_task
from django.utils.timezone import now
from django.utils import timezone
from django.core.mail import send_mail
# from .models import License

from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from .models import Software, Notify



###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE2---#####
@shared_task
def check_expiry_license():
    upcoming_licenses = Software.objects.filter(expiry_date__lte=now().date())

    for software in upcoming_licenses:
        notification = Notify.objects.create(
            software=software,
            message=f"Your license '{software.type_license}' is expiring soon!"
        )
        
        channel_layer = get_channel_layer()
        channel_layer.group_send(
            "notifications",
            {
                "type": "send_notification",  
                "message": notification.message
            }
        )
     
@shared_task
def send_software_reminder():
    today = now().date()
    license_obj = Software.objects.all()

    for days in [30, 15, 7]:
        reminder_date = today + timedelta(days=days)
        expiring_licenses = Software.objects.filter(expiry_date=reminder_date)


        
        for license_obj in expiring_licenses:
            if license_obj.User_Profile and license_obj.User_Profile.email:
                subject = f"Reminder: Your {license_obj.type_license} Expires Soon"
                message = f"""
                Dear Customer,

                Your software license for {license_obj.issuing_authority} is set to expire on {license_obj.expiry_date}.
                Please renew it to avoid stress and other delays.

                Thank you,
                ABC Bank Group
                """

                send_mail(
                    subject,
                    message,
                    from_email="alisuleimann4@gmail.com",
                    recipient_list=[license_obj.User_Profile.email],
                    fail_silently=False
                )

    return "Notification Emails Sent!"






###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE1---#####
# @shared_task
# def send_renewal_reminder():
#     today = timezone.now().date()
#     licenses = License.objects.filter(expiry_date__gte=today)

#     for license in licenses:
        
#         expiry_date = license.expiry_date
#         if (expiry_date - today).days <= 30:
#             send_mail(
#                 'License Renewal Reminder',
#                 f'Your {license.license_type} license is due for renewal soon. Expiry date: {expiry_date}.',
                
#                 [license.User.email],
#                 fail_silently=False,
#             )
#     return 'Renewal reminders sent.'