from django.contrib import admin    
from .models import Users, Providers, Subscription, Renewals



class UsersAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'middle_name', 'last_name', 'username', 'phone_number', 'email')
    search_fields = ('first_name', 'middle_name', 'last_name', 'email')


class ProvidersAdmin(admin.ModelAdmin):
    list_display = ('service_provider', 'address', 'description')
    search_fields = ('service_provider',)


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('subscription_type', 'amount_paid', 'duration', 'issue_date', 'expiry_date', 'status', 'providers', 'users')
    search_fields = ('subscription_type', 'providers__service_provider', 'users__name', 'status')
    list_filter = ('subscription_type', 'providers', 'status')


class RenewalsAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'renewal_date', 'expiry_date', 'paid_amount', 'invoice_no')
    search_fields = ('subscription__subscription_type', 'invoice_no')
    list_filter = ('renewal_date', 'expiry_date')


admin.site.register(Users, UsersAdmin)
admin.site.register(Providers, ProvidersAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Renewals, RenewalsAdmin)


