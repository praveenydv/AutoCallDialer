
from django.shortcuts import get_object_or_404
from django.http import Http404,JsonResponse,HttpResponse
from backend.wsgi import client
from rest_framework import permissions
from django.db.models import Q
from itertools import chain
from calldialer.models import User,Phonebook,Contact,CallRecord
from rest_framework.views import APIView
from calldialer.views import get_user
from rest_framework.decorators import api_view,permission_classes
from rest_framework.parsers import JSONParser
from twilio.twiml.voice_response import Say,VoiceResponse
from rest_framework.response import Response
import json
from urllib.parse import parse_qs
import datetime
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
)
from twilio.base.exceptions import TwilioRestException

from .serializers import PhonebookSerializer,PhonebookContactAddSerializer,PhonebookContactRemoveSerializer,ContactCreateSerializer,ContactSerializer,CallRecordSerializer,MakeCallSerializer,UserUpdateSerializer,RegisterSerializer
from rest_framework import status

from rest_auth.views import LoginView
from rest_auth.registration.views import RegisterView

class CustomLoginView(LoginView):
    def get_response(self):
        orginal_response = super().get_response()
        mydata = {"username":self.user.username}
        orginal_response.data.update(mydata)
        return orginal_response

class CustomRegisterView(RegisterView):
    serializer_class = RegisterSerializer

    def get_response_data(self,user):
        orginal_response = super().get_response_data(user)
        mydata = {"username":user.username}
        orginal_response['username']=user.username
        return orginal_response




class PhonebookListView(ListAPIView):
    serializer_class=PhonebookSerializer
    permission_classes=(permissions.AllowAny,)

    def get_queryset(self):
        queryset=Phonebook.objects.all()
        user=self.request.user
        queryset=queryset.filter(user__username=user.username)
        print(queryset)
        return queryset


class PhonebookCreateView(CreateAPIView):
    queryset=Phonebook.objects.all()
    serializer_class=PhonebookSerializer
    permission_classes=(permissions.AllowAny,)

class PhonebookUpdateView(UpdateAPIView):
    queryset=Phonebook.objects.all()
    serializer_class=PhonebookSerializer
    permission_classes=(permissions.AllowAny,)

class PhonebookDeleteView(DestroyAPIView):
    queryset=Phonebook.objects.all()
    serializers_class=PhonebookSerializer
    permission_classes=(permissions.AllowAny,)

    def get_object(self,pk):
        try:
            return Phonebook.objects.get(pk=pk)
        except Phonebook.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        phonebook = self.get_object(pk)
        if self.request.user==phonebook.user:
            phonebook.delete()
            return JsonResponse({'message':"Success",'detail':"Deleted successfully!"}, status=200)

        else:
            return JsonResponse({'message':"Invalid Request",'detail':"User does not have this permission!"}, status=400)






class UserUpdateView(UpdateAPIView):
    queryset=User.objects.all()
    serializer_class=UserUpdateSerializer
    permission_classes=(permissions.AllowAny,)

    def get_object(self):
        return User.objects.get(username=self.request.data.get('username'))



class PhonebookContactListView(ListAPIView):
    serializer_class=ContactSerializer;
    permission_classes=(permissions.AllowAny,)

    def get_queryset(self):
        pk = self.kwargs.get('pk')

        # pk=self.request.data.get('pb_id')
        print('pk............................',pk)
        pb=Phonebook.objects.get(pk=pk)
        queryset = pb.contacts.all()
        if self.request.user==pb.user:
            return queryset
        else:
            return JsonResponse({'message':"Invalid Request",'detail':"User does not have this permission!"}, status=400)
    


class PhonebookContactCreateView(CreateAPIView):
    queryset=Contact.objects.all();
    serializer_class=ContactCreateSerializer;
    permission_classes=(permissions.AllowAny,)
    



class PhonebookContactRemoveView(UpdateAPIView):
    queryset=Phonebook.objects.all();
    serializer_class=PhonebookContactRemoveSerializer;
    permission_classes=(permissions.AllowAny,)
    


class PhonebookContactAddView(UpdateAPIView):
    queryset=Phonebook.objects.all();
    serializer_class=PhonebookContactAddSerializer;
    permission_classes=(permissions.AllowAny,)
    




class ContactListView(ListAPIView):
    serializer_class=ContactSerializer;
    permission_classes=(permissions.AllowAny,)
    queryset=Contact.objects.all()

    def get_queryset(self):
            return Contact.objects.filter(user=self.request.user)



class ContactCreateView(CreateAPIView):
    serializer_class=ContactSerializer;
    permission_classes=(permissions.AllowAny,)
    queryset=Contact.objects.all()



class ContactUpdateView(UpdateAPIView):
    serializer_class=ContactSerializer;
    permission_classes=(permissions.AllowAny,)
    queryset=Contact.objects.all()

    def get_object(self):
        pk = self.kwargs.get('pk')
        contact=Contact.objects.get(pk=pk)
        if contact.user==self.request.user:
            return contact
        else: 
            return JsonResponse({'message':"Invalid Request",'detail':"User does not have this permission!"}, status=400)




class ContactDeleteView(DestroyAPIView):
    serializer_class=ContactSerializer;
    permission_classes=(permissions.AllowAny,)
    queryset=Contact.objects.all()

    def delete(self, request, pk, format=None):
        contact=Contact.objects.get(pk=pk)
        if self.request.user==contact.user:
            contact.pbcontact.clear();
            contact.user=None;
            contact.save()
            return JsonResponse({'message':"Success",'detail':"Deleted successfully!"}, status=200)
        else:
            return JsonResponse({'message':"Invalid Request",'detail':"User does not have this permission!"}, status=400)



   




class CallRecordListview(ListAPIView):
    serializer_class=CallRecordSerializer;
    permission_classes=(permissions.AllowAny,)

    def get_queryset(self):
        queryset=CallRecord.objects.filter(user=self.request.user)
        return queryset

class MakeCallView(CreateAPIView):
    serializer_class=MakeCallSerializer;
    permission_classes=(permissions.AllowAny,)


@api_view(['POST'])
def MakeCall_View(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = MakeCallSerializer(data=data)
        if serializer.is_valid():
            phonebook=Phonebook.objects.get(pk=int(data['pb_id']));
            if phonebook.user==request.user:
                contacts=phonebook.contacts.all();
                for contact in contacts:
                    callToContact(contact,data['text'],request.user)


                return JsonResponse({'detail':"Call has been made successfully!"}, status=200)     
            else:
                return JsonResponse({'message':"Invalid Request",'detail':"User does not have this permission!"}, status=400)     
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def callToContact(contact,text,user):
    text=text.format(first_name=contact.fname,last_name=contact.lname,city=contact.city,phone_number=contact.pnumber)    
    print(contact.pnumber)
    try:
        call = client.calls.create(
    
                            twiml=f'<Response><Say  voice="woman">{text}</Say></Response>',
                            to=contact.pnumber,
                            from_=os.environ['TWILIO_CALL_NUMBER'],
                            status_callback=os.environ['CALL_RESPONSE_URL'],
                            status_callback_event=['initiated','completed'],
                            status_callback_method='POST',
        )
   
    except TwilioRestException as e:
        print(e)
        e.code 
        return;
    callrecord=CallRecord(callsid=call.sid,user=user,contact=contact)
    callrecord.save()
    print(call.sid) 

    
    


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def CallResponse_View(request):
    if request.method=='POST':
        url_data = request.body.decode('utf-8')
        data=parse_qs(url_data)
        callrecord=CallRecord.objects.get(callsid=data['CallSid'][0])
        print(callrecord.callstarttime)

        if data['CallStatus'][0]=='initiated':
            callrecord.callstarttime= datetime.datetime.strptime(data['Timestamp'][0], '%a, %d %b %Y %H:%M:%S +%f').strftime('%Y-%m-%d %H:%M:%S.%f')
            callrecord.save()
        else:
            callrecord.callduration=float(data['CallDuration'][0])
            callrecord.callcost="{:.5f}".format(int(data['CallDuration'][0])/60*float(os.environ['CALL_RATE']))
            callrecord.callstatus=data['CallStatus'][0]
            callrecord.save();



        return JsonResponse({'detail':"Call respponse is received successfully!"}, status=200)     

    
