from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, Message
from .models import UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'photo': user.profile.photo.url if hasattr(user, 'profile') and user.profile.photo else None
        }
        return data

from rest_framework.reverse import reverse

class UserProfileSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False, min_length=6)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = UserProfile
        fields = ['photo', 'current_password', 'new_password', 'confirm_password']

    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None

    def validate(self, data):
        user = self.context['request'].user

        if data.get('new_password') or data.get('confirm_password'):
            if not data.get('current_password'):
                raise serializers.ValidationError({"current_password": "Current password is required."})

            if not user.check_password(data['current_password']):
                raise serializers.ValidationError({"current_password": "Current password is incorrect."})

            if data.get('new_password') != data.get('confirm_password'):
                raise serializers.ValidationError({"confirm_password": "New passwords do not match."})

        return data

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if 'new_password' in validated_data:
            user.set_password(validated_data['new_password'])
            user.save()

        validated_data.pop('current_password', None)
        validated_data.pop('new_password', None)
        validated_data.pop('confirm_password', None)

        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if instance.photo and request:
            rep['photo'] = request.build_absolute_uri(instance.photo.url)
        return rep

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def get_profile(self, obj):
        if hasattr(obj, 'profile'):
            return {
                'photo': obj.profile.photo.url if obj.profile.photo else None
            }
        return None

class RegisterSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'photo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        photo = validated_data.pop('photo', None)  # safely extract photo
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        if photo:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.photo = photo
            profile.save()

        return user
    

class ChatRoomSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = ChatRoom
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'content', 'timestamp']
        read_only_fields = ['sender', 'room', 'timestamp']

    def get_sender(self, obj):
        profile = getattr(obj.sender, 'profile', None)
        return {
            'id': obj.sender.id,
            'username': obj.sender.username,
            'email': obj.sender.email,
            'photo': profile.photo.url if profile and profile.photo else None
        }
