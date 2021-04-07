from rest_framework import serializers
from calldialer.models import User,Phonebook,Contact,CallRecord
from calldialer.views import get_user
from django.http import Http404,JsonResponse
from django.db import models
try:
    from allauth.account import app_settings as allauth_settings
    from allauth.utils import (email_address_exists,
                               get_username_max_length)
    from allauth.account.adapter import get_adapter
    from allauth.account.utils import setup_user_email
    from allauth.socialaccount.helpers import complete_social_login
    from allauth.socialaccount.models import SocialAccount
    from allauth.socialaccount.providers.base import AuthProcess
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")
from django.utils.translation import gettext as _

from rest_framework.utils.field_mapping import get_nested_relation_kwargs
from rest_auth.serializers import PasswordResetSerializer

class CustomPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        extra_context = {'url':'/password/reset'}  # your extra context parameters
        return {
                # 'domain_override': settings.FRONTEND_URL,
                'email_template_name': 'resetpassemail/custom_reset_email.txt',
                # 'html_email_template_name': 'resetpassemail/custom_reset_email.html',
                'extra_email_context': extra_context
            } 


class UserDetailSerializer(serializers.StringRelatedField):
    def to_internal_value(self,value):
        return value



class PhonebookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Phonebook
        fields=['id','pbname']

    def create(self,validated_data):
        pbname=validated_data.pop('pbname')
        phonebook=Phonebook()
        request = self.context.get('request', None)
        phonebook.user=request.user
        phonebook.pbname=pbname
        phonebook.save()
        return phonebook;
    
    def update(self, instance, validated_data):
        pbname=validated_data.pop('pbname')
        request = self.context.get('request', None)
        if instance.user==request.user:

            instance.pbname=pbname;
            instance.save()
            return instance
        else:
            return serializers.ValidationError({'message':"Invalid Request and User does not have this permission!"})


class PhonebookContactRemoveSerializer(serializers.ModelSerializer):
    class Meta:
        model=Phonebook
        fields=['id','contacts']

    def update(self, instance, validated_data):
        contacts=validated_data.pop('contacts')
        request = self.context.get('request', None)
        if instance.user==request.user:
            for contact in contacts:
                instance.contacts.remove(contact)
                instance.save()
            return instance
        else:
            return serializers.ValidationError({'message':"Invalid Request and User does not have this permission!"})

class PhonebookContactAddSerializer(serializers.ModelSerializer):
    class Meta:
        model=Phonebook
        fields=['id','contacts']

    def update(self, instance, validated_data):
        contacts=validated_data.pop('contacts')


        request = self.context.get('request', None)
        if instance.user==request.user:
            for contact in contacts:
                print(contact)
                instance.contacts.add(contact)
                instance.save()
            return instance
        else:
            return serializers.ValidationError({'message':"Invalid Request and User does not have this permission!"})



class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model=Contact
        fields=['id','fname','lname','city','pnumber']

    def create(self,validated_data):
        contact=Contact(**validated_data)
        request = self.context.get('request', None)
        contact.user=request.user
        contact.save()
        return contact;


class ContactCreateSerializer(serializers.ModelSerializer):
    pb_id=serializers.IntegerField(write_only=True)

    class Meta:
        model=Contact
        fields=['id','pb_id','fname','lname','city','pnumber']

    def create(self,validated_data):
        pb_id=validated_data.pop('pb_id')
        request = self.context.get('request', None)
        phonebook=Phonebook.objects.get(pk=int(pb_id));
        if phonebook.user==request.user:
            contact=Contact.objects.create(**validated_data)
            contact.user=request.user
            contact.save();
            phonebook.contacts.add(contact)
            phonebook.save();
            return contact;
        else:
            return serializers.ValidationError({'message':"Invalid Request and User does not have this permission!"})
    


class CallRecordSerializer(serializers.ModelSerializer):
    contact=ContactSerializer()
    class Meta:
        model=CallRecord
        depth=1
        fields=['id','callstarttime','callduration','callcost','callstatus','contact']


class  MakeCallSerializer(serializers.ModelSerializer):
    pb_id=serializers.IntegerField(write_only=True)
    text=serializers.CharField(write_only=True)
    class Meta:
        model=CallRecord
        fields=['pb_id','text']
        
class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields=('username','first_name','last_name','profile_image','dob',)
   
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=allauth_settings.USERNAME_REQUIRED
    )
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    dob=serializers.DateField()

    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(_("The two password fields didn't match."))
        return data

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'dob': self.validated_data.get('dob', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user