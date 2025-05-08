from django.db.models.signals import post_save, pre_save
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from datetime import date, timedelta
from .models import Subscriptions, Notification, User



@receiver(user_logged_in)
def first_admin(sender, request, user, **kwargs):

    if User.objects.count() < 1:
        user.is_superuser = True
        user.is_staff = True
        user.userRole = 'superuser'
        user.save()
    elif not user.is_superuser:
        user.is_staff = True
        user.userRole = 'admin'
        user.save()
        


@receiver(post_save, sender=Subscriptions)
def create_subscription_notification(sender, instance, created, **kwargs):
    if created:
        message = f"Welcome {instance.owner_first_name} {instance.owner_last_name}, you have been assigned a new subscription."
        Notification.objects.create(recipient=instance.user, message=message)


@receiver(pre_save, sender=Subscriptions)
def create_subscription_expiry_notification(sender, instance, **kwargs):
    if instance.expiring_date and instance.expiring_date <= date.today() + timedelta(days=7):
        message = f"The {instance.sub_type} subscription for {instance.owner_first_name} {instance.owner_last_name} is expiring soon on {instance.expiring_date}."
        Notification.objects.create(recipient=instance.user, message=message)