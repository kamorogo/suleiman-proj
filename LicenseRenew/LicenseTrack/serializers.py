from rest_framework import serializers
# from .models import License, Notification

from .models import Software, Notify, Renew


###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE2---###
class SoftwareSerializer(serializers.ModelSerializer):

    class Meta:
        model = Software
        fields = '__all__'

class NotifySerializer(serializers.ModelSerializer):
    class Meta:
        model = Notify
        fields = ['id', 'software', 'user_profile', 'type_notification', 'date_notification', 'sent_notification', 'subject', 'message', 'is_read', 'created_at']

  







###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE1---###
# class LicenseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = License
#         fields = '__all__'


# class NotificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Notification
#         fields = '__all__'


