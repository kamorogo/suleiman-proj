from rest_framework import serializers
# from .models import License, Notification

from .models import Licenses, Users, Renewals, LicenseType


###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE2---###
class LicensesSerializer(serializers.ModelSerializer):
    licensetype = serializers.CharField(source='licensetype.type_license')

    class Meta:
        model = Licenses
        fields = '__all__'

class UserSSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['name', 'email', 'phone_number']





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


