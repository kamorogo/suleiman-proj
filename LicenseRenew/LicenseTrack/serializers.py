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
        fields = '__all__'

  







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


