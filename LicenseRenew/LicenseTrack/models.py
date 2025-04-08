from django.db import models
from datetime import date, timedelta
from django.utils.timezone import now
from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings




            ####----USECASE2----####
class Users(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255, null=False, blank=False)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(null=True, blank=True, default=timezone.now)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'name', 'phone_number']

    def set_password(self, raw_password):
       
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        
       
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.name

# class UserProfile(models.Model):
#     user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='profile')
#     bio = models.TextField(blank=True, null=True)
#     profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
#     address = models.TextField(blank=True, null=True)


#     def __str__(self):
#         return f"{self.user.name}'s Profile"
   
    
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
    document = models.FileField(upload_to="subscription/",  null=True, blank=True)
    providers = models.ForeignKey(Providers, on_delete=models.CASCADE, related_name='subscription')
    users = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='subscription')
    
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



