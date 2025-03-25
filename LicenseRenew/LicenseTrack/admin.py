from django.contrib import admin    
from .models import Users, LicenseType, Licenses, Renewals
# from .models import License, User, Renewal, Notification # imports all models defined in model.py in our app



###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE2---###
@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email')
    search_fields = ('name', 'email')
    list_filter = ('phone_number',)

@admin.register(LicenseType)
class LicenseTypeAdmin(admin.ModelAdmin):
    list_display = ('type_license', 'description')
    search_fields = ('type_license',)
    list_filter = ('type_license',)

@admin.register(Licenses)
class LicensesAdmin(admin.ModelAdmin):
    list_display = ('provider', 'licensetype', 'users', 'duration', 'document')
    search_fields = ('provider', 'licensetype__name', 'users__name')  
    list_filter = ('licensetype', 'users')

@admin.register(Renewals)
class RenewalsAdmin(admin.ModelAdmin):
    list_display = ('licenses', 'renewal_date', 'expiry_date', 'paid_amount', 'invoice_no')
    search_fields = ('licenses__provider', 'invoice_no')
    list_filter = ('renewal_date', 'licenses')











###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE1---###
# class LicenseAdmin(admin.ModelAdmin):
#     # customizing list display of all fields as they appear in my model
#     list_display = ('license_number', 'holder_name', 'license_type', 'expiry_date')
#     # Adding which fields can be searched
#     search_fields = ('license_number', 'holder_name')
#     # Fields that can be read and not edited
#     readonly_fields = ('license_number', 'holder_name')
#     # Add filters so that the user can filters by status of a license
#     list_filters = ('expiry_date')


# #we register the License model in admin so that can be managed via admin interface
# admin.site.register(License, LicenseAdmin)

# # Notification Model
# class NotificationAdmin(admin.ModelAdmin):
#     list_display = ('license', 'user', 'notification_type', 'notification_date', 'is_sent')
#     search_fields = ('license_number', 'user_email')
#     list_filters = ('is_sent', 'notification_type')

# admin.site.register(Notification, NotificationAdmin)

# # Renewal Model
# class RenewalAdmin(admin.ModelAdmin):
#     list_display = ('license', 'renewal_date', 'new_expiration_date', 'renewal_fee', 'renewal_method')
#     search_fields = ('renewal_date', 'new_expiration_date')
#     list_filters = ('renewal_method', 'renewal_fee')

# admin.site.register(Renewal, RenewalAdmin)

# # User Model
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('first_name', 'last_name', 'email', 'phone_number')
#     search_fields = ('first_name', 'last_name', 'email')
#     ordering = ('email',)

# admin.site.register(User, UserAdmin)
