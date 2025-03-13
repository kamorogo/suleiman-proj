from django.contrib import admin
from .models import Software, User_Profile, Notify, Renew
# from .models import License, User, Renewal, Notification # imports all models defined in model.py in our app



###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE2---###

@admin.register(Software)
class SoftwareAdmin(admin.ModelAdmin):
    list_display = ('type_license', 'issuing_authority', 'expiry_date', 'created_at')
    search_fields = ('issuing_authority', 'type_license')
    list_filter = ('type_license', 'expiry_date')
    ordering = ('-expiry_date',)

@admin.register(User_Profile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'email')
    search_fields = ('user__username', 'email', 'phone_number')

@admin.register(Notify)
class NotifyAdmin(admin.ModelAdmin):
    list_display = ('software', 'user_profile', 'type_notification', 'date_notification', 'is_read')
    list_filter = ('type_notification', 'is_read')
    search_fields = ('software__issuing_authority', 'user_profile__user__username')
    ordering = ('-date_notification',)

@admin.register(Renew)
class RenewAdmin(admin.ModelAdmin):
    list_display = ('software', 'renew_date', 'renew_status', 'renew_fee')
    list_filter = ('renew_status', 'renew_date')
    search_fields = ('software__issuing_authority',)
    ordering = ('-renew_date',)








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
