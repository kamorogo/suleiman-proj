from django.db import models
from datetime import datetime
from datetime import date, timedelta
from django.utils.timezone import now
from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings


class Users(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=100, null=False, blank=False)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(null=True, blank=True, default=timezone.now)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'middle_name', 'last_name', 'phone_number']

    def set_password(self, raw_password):
       
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        
       
        return check_password(raw_password, self.password)

    
    def full_name(self):
        return f"{self.first_name} {self.middle_name or ''} {self.last_name}".strip()

class User_Profile(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    postcode = models.CharField(max_length=20, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.name}'s Profile"
   
    
class Providers(models.Model):
    service_provider = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    description = models.TextField(max_length=510)

    def __str__(self):
        return self.service_provider
    

STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('decommissioned', 'Decommissioned')
]
class Subscription(models.Model):
    DURATION_TYPE_MAP = {
        0: "Trial",
        1: "Monthly",
        3: "Quarterly",
        6: "Semi-Annual",
        12: "Annual",
        24: "Biennial",
        36: "Triennial",
        48: "Quadrennial",
    }
    subscription_type = models.CharField(max_length=255, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField()
    issue_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    document = models.FileField(upload_to="subscription/",  null=True, blank=True)
    providers = models.ForeignKey(Providers, on_delete=models.CASCADE, related_name='subscription')
    users = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='subscription')
    

    def __str__(self):
        return f"{self.subscription_type} - {self.providers.service_provider}"

    def update_status(self):
        today = date.today()
        if self.status == 'decommissioned':
            return

        # Ensure both expiry_date and today are datetime.date objects
        if isinstance(self.expiry_date, str):
            self.expiry_date = datetime.strptime(self.expiry_date, "%Y-%m-%d").date()

        if isinstance(self.issue_date, str):
            self.issue_date = datetime.strptime(self.issue_date, "%Y-%m-%d").date()

        if self.expiry_date < today:
            self.status = 'expired'
        else:
            self.status = 'active'

    def save(self, *args, **kwargs):
        if isinstance(self.expiry_date, str):
            self.expiry_date = datetime.strptime(self.expiry_date, "%Y-%m-%d").date()

        if isinstance(self.issue_date, str):
            self.issue_date = datetime.strptime(self.issue_date, "%Y-%m-%d").date()

        self.subscription_type = self.DURATION_TYPE_MAP.get(self.duration, f"{self.duration} Months")

        if self.id:
            old = Subscription.objects.get(id=self.id)
            if old.providers != self.providers:
                self.status = 'decommissioned'
            elif self.expiry_date < timezone.now().date():
                self.status = 'expired'
            else:
                self.status = 'active'
        else:
            if self.expiry_date < timezone.now().date():
                self.status = 'expired'
            else:
                self.status = 'active'

        super().save(*args, **kwargs)

   
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



