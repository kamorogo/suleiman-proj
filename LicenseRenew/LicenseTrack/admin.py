from django.contrib import admin    
from .models import Users, Providers, Subscription, Renewals

#----V2-----#
from .models import User, Employees, Subscriptions, Notification



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
    list_display = (
        'subscription', 'renewal_date', 'old_expiry_date', 'new_expiry_date', 'paid_amount', 'receipt', 'renewed_by'
    )
    search_fields = (
        'subscription__users__username', 'subscription__providers__service_provider', 'renewed_by__username'
    )
    list_filter = ('renewal_date', 'renewed_by')
    date_hierarchy = 'renewal_date'


admin.site.register(Users, UsersAdmin)
admin.site.register(Providers, ProvidersAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Renewals, RenewalsAdmin)




#--------VERSION2---------#
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'userRole', 'is_staff', 'is_superuser']
    list_filter = ['userRole', 'is_staff', 'is_superuser']
    search_fields = ['username', 'email']
    ordering = ['username']

class EmployeesAdmin(admin.ModelAdmin):
    list_display = ['firstName', 'lastName', 'employeesEmail', 'department']
    filter_horizontal = ('assigned_subscriptions',)

class SubscriptionsAdmin(admin.ModelAdmin):
    list_display = ['sub_type', 'issuing_authority', 'issuing_date', 'expirying_date', 'is_document_uploaded']

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('message', 'read', 'created_at')  
    list_filter = ('read', 'created_at')  
    search_fields = ('message',)  
    ordering = ('-created_at',) 

admin.site.register(User, UserAdmin)
admin.site.register(Employees, EmployeesAdmin)
admin.site.register(Subscriptions, SubscriptionsAdmin)
admin.site.register(Notification, NotificationAdmin)