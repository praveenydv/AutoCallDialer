from django.urls import path,re_path
from django.conf.urls import include,url
from rest_auth import views as rest_auth_views
from .views import CustomLoginView,CustomRegisterView
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView


from .views import (
    PhonebookListView,
    PhonebookDeleteView,
    PhonebookCreateView,
    PhonebookUpdateView,
    PhonebookContactListView,
    PhonebookContactCreateView,
    ContactUpdateView,
    PhonebookContactRemoveView,
    PhonebookContactAddView,
    ContactListView,
    ContactDeleteView,
    ContactCreateView,
    CallRecordListview,
    MakeCall_View,
    CallResponse_View,

)




urlpatterns=[
    path('phonebook/',PhonebookListView.as_view()),
    path('phonebook/<pk>/delete/',PhonebookDeleteView.as_view()),
    path('phonebook/create/',PhonebookCreateView.as_view()),
    path('phonebook/<pk>/update/',PhonebookUpdateView.as_view()),


    path('phonebook/<pk>/contact/',PhonebookContactListView.as_view()),
    path('phonebook/<pk>/contact/add/',PhonebookContactAddView.as_view()),
    path('phonebook/contact/create/',PhonebookContactCreateView.as_view()),
    path('phonebook/<pk>/contact/remove/',PhonebookContactRemoveView.as_view()),
    
    path('contact/',ContactListView.as_view()),
    path('contact/<pk>/delete/',ContactDeleteView.as_view()),
    path('contact/create/',ContactCreateView.as_view()),
    path('contact/<pk>/update/',ContactUpdateView.as_view()),

    path('callrecord/',CallRecordListview.as_view()),

    path('makecall/',MakeCall_View),
    path('callresponse/',CallResponse_View),

    path('auth/login/', csrf_exempt(CustomLoginView.as_view())),
    path('auth/registration/', CustomRegisterView.as_view()),
    # path('auth/registration/', NewCustomRegisterView.as_view()),
    path('auth/password/reset/', rest_auth_views.PasswordResetView.as_view()),
    path('auth/password/reset/confirm/', rest_auth_views.PasswordResetConfirmView.as_view()),
    path('auth/logout/', rest_auth_views.LogoutView.as_view()),

]