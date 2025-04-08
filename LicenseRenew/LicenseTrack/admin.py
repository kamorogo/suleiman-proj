from django.contrib import admin    
from .models import Users, Providers, Subscription, Renewals


                ###---USECASE2---###
# Register Users model
class UsersAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email')
    search_fields = ('name', 'email')

# Register Providers model
class ProvidersAdmin(admin.ModelAdmin):
    list_display = ('service_provider', 'address', 'description')
    search_fields = ('service_provider',)

# Register Subscription model
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('subscription_type', 'amount_paid', 'duration', 'issue_date', 'expiry_date', 'providers', 'users')
    search_fields = ('subscription_type', 'providers__service_provider', 'users__name')
    list_filter = ('subscription_type', 'providers')

# Register Renewals model
class RenewalsAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'renewal_date', 'expiry_date', 'paid_amount', 'invoice_no')
    search_fields = ('subscription__subscription_type', 'invoice_no')
    list_filter = ('renewal_date', 'expiry_date')

# Register models to the admin site
admin.site.register(Users, UsersAdmin)
admin.site.register(Providers, ProvidersAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Renewals, RenewalsAdmin)


