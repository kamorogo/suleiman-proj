from rest_framework import serializers
# from .models import License, Notification

from drf_writable_nested import WritableNestedModelSerializer
from .models import Subscription, Users, Renewals, Providers


###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ###---USECASE2---###
class ProvidersSerializer(serializers.Serializer):

    class Meta:
        model = Providers
        fields =  '__all__'


class SubscriptionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    providers = serializers.CharField(source='providers.service_provider')
    

    class Meta:
        model = Subscription
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


