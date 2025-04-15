from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_writable_nested import WritableNestedModelSerializer
from .models import Subscription, Users, Renewals, Providers, User_Profile


class ProvidersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Providers
        fields =  '__all__'

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'password', 'first_name', 'middle_name', 'last_name', 'phone_number', 'email']

class SubscriptionSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    providers = serializers.CharField(source='providers.service_provider')
    users = UsersSerializer()
    

    class Meta:
        model = Subscription
        fields = ['id', 'subscription_type', 'amount_paid', 'duration', 'issue_date', 'expiry_date', 'document', 'status', 'providers', 'users']


    def update(self, instance, validated_data):
        providers_data = validated_data.pop('providers', None)
        if providers_data:
            provider_instance = instance.providers
            for attr, value in providers_data.items():
                setattr(provider_instance, attr, value)
            provider_instance.save()

        validated_data.pop('users', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()  
        return instance


class User_ProfileSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)

    class Meta:
        model = User_Profile
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        instance.bio = validated_data.get('bio', instance.bio)
        instance.address = validated_data.get('address', instance.address)

        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']

        instance.save()
        return instance



class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['username', 'name', 'phone_number', 'email', 'password']

    def create(self, validated_data):
        user = Users(
            username=validated_data['username'],
            name=validated_data['name'],
            phone_number=validated_data.get('phone_number', ''),
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  
        user.save()
        return user

class SignInSerializer(serializers.Serializer):
    
    username = serializers.CharField(max_length=255, required=True)
    
    password = serializers.CharField(write_only=True, required=True)
