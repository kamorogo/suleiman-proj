from django.db import models
from datetime import date, timedelta
from django.utils.timezone import now
from dateutil.relativedelta import relativedelta


###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


            ####----USECASE2----####
class Users(models.Model):
    name =  models.CharField(max_length=255, null=False, blank=False)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name
    
class Providers(models.Model):
    service_provider = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    description = models.TextField(max_length=510)

    def __str__(self):
        return self.service_provider
    
class Subscription(models.Model):
    subscription_type = models.CharField(max_length=255)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField()
    issue_date = models.DateField()
    expiry_date = models.DateField()
    document = models.FileField(upload_to="subscription/", blank=True, null=True)
    providers = models.ForeignKey(Providers, on_delete=models.CASCADE, related_name='subscription')
    users = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='subscription', null=True, blank=True)
    
    def __str__(self):
        return f"{self.subscription_type} - {self.providers.service_provider}"
   
class Renewals(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='renewals')
    renewal_date = models.DateField(default=now)
    expiry_date = models.DateField(editable=False)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    invoice_no = models.CharField(max_length=10, unique=True)
    receipt = models.FileField(upload_to='receipt/')

    def save(self, *args, **kwargs):
        
        if not self.renewal_date:
            self.renewal_date = now().date()
        
        subscription_duration = self.subscription.duration

        self.expiry_date = self.renewal_date + relativedelta(months=subscription_duration)

        super().save(*args, **kwargs) 

    def __str__(self):
        return f"{self.subscription} (Renewed on: {self.renewal_date} & Expires: {self.expiry_date} )"







###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE1---#####
# class License(models.Model):
#     LICENSE_TYPES = [
#         ('DRIVING LICENCE', 'DRIVING LICENSE'),
#         ('SINGLE BUSINESS PERMIT', 'BUSINESS LICENSE'),
#         ('SOFTWARE LICENSE', 'SOFTWARE PERMIT'),
#         ('other', 'Other')
#     ]
#     license_number = models.CharField(max_length=100, unique=True)  
#     national_id = models.CharField(max_length=20, null=True, blank=True)
#     holder_name = models.CharField(max_length=200)  
#     license_type = models.CharField(max_length=100, choices=LICENSE_TYPES)  
#     issue_date = models.CharField(max_length=200)  
#     expiry_date = models.DateField(default=default_expiry_date)  
#     # renewal_status = models.CharField(max_length=20, choices=[('active', 'Active'), ('expired', 'Expired'), ('renewed', 'Renewed')], default='active')  # Status of the license: active, expired or renewed
#     # renewal_date = models.DateField(null=True, blank=True)  
#     # holder_email = models.EmailField(null=True, blank=True)  
#     # gender = models.CharField(max_length=10, null=True)
#     date_birth = models.CharField(max_length=100, null=True, blank=True) 
#     # vehicle_category = models.CharField(max_length=200, null=True)
#     document = models.FileField(upload_to='License/', null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')


#     def __str__(self):
#         return f"License {self.license_number} - {self.holder_name}"    
#     # Check if the license is expired
#     def is_expired(self):
#         return self.expiry_date - timezone.now().date()
#     def days_until_expiry(self):
#         return (self.expiry_date - timezone.now().date()).days
#     # Renewal
#     def update_renewal(self):
#         self.last_renewed_date = timezone.now().date()
#         self.expiry_date = self.expiry_date + timedelta(days=365)
#         self.renewal_status = 'Completed'
#         self.save()


# # USER MODEL
# class User(models.Model):
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     phone_number = models.CharField(max_length=15, null=True, blank=True)

#     def __str__(self):
#         return f"{self.first_name} {self.last_name}"


# # NOTIFICATION MODEL
# class Notification(models.Model):
#     license = models.ForeignKey(License, on_delete=models.CASCADE, related_name='notifications')
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
#     notification_type = models.CharField(max_length=50, choices=[('Expiry', 'Expiry'), ('Renewal Reminder', 'Renewal Reminder')])
#     notification_date = models.DateField(auto_now_add=True)
#     is_sent = models.BooleanField(default=False)
#     message = models.TextField(default=False)
#     read = models.BooleanField(default=False)

   

#     def __str__(self):
#         return f"Notification for {self.license.license_number} ({self.notification_type})"


# # RENEWAL MODEL
# class Renewal(models.Model):
#     license = models.ForeignKey(License, on_delete=models.CASCADE, related_name='renewals')
#     renewal_date = models.DateField()
#     new_expiration_date = models.DateField()
#     renewal_fee = models.DecimalField(max_digits=10, decimal_places=2)
#     renewal_method = models.CharField(max_length=100)
#     notifications = models.JSONField(default=list)

#     def __str__(self):
#         return f"Renewal for {self.license.license_number} on {self.renewal_date}"

    
