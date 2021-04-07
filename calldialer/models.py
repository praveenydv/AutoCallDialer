from django.db import models
from datetime import datetime,date
import os
from uuid import uuid4
from django.utils.deconstruct import deconstructible
from django.contrib.auth.models import AbstractUser 
from django.utils.timezone import now
today = date.today()


@deconstructible
class PathAndRename(object):
    def __init__(self, sub_path):
        self.path = sub_path
    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = '{}.{}'.format(uuid4().hex, ext)
        return os.path.join(self.path, filename)

class User(AbstractUser): 
    dob=models.DateField(default=today)
    profile_image = models.ImageField(upload_to=PathAndRename('images/profiles/'),default='images/default_images/avatar.jpg',blank=True) 
 
class Contact(models.Model):
    user=models.ForeignKey(User,related_name='cont_user',on_delete=models.SET_NULL,null=True) 
    fname =models.CharField(max_length=25, default="Fname")
    lname =models.CharField(max_length=25, default="Lname")
    city =models.CharField(max_length=25, default="City")
    pnumber= models.CharField(max_length=20)
    lastedittime=models.DateTimeField('date_published', auto_now=True)


class Phonebook(models.Model):
    user=models.ForeignKey(User,related_name='pb_user',on_delete=models.CASCADE) 
    pbname =models.CharField(max_length=30, default="Phonebook")
    contacts=models.ManyToManyField(Contact,related_name='pbcontact',null=True,blank=True)
    lastedittime=models.DateTimeField('date_published', auto_now=True)


class CallRecord(models.Model):
    user=models.ForeignKey(User,related_name='cr_user',on_delete=models.SET_NULL,null=True) 
    contact=models.ForeignKey(Contact,related_name='contact',on_delete=models.SET_NULL,null=True)
    callsid=models.CharField(max_length=50,default='xxxxxxxxxxx')
    callstarttime=models.DateTimeField(default=now)
    callduration =models.IntegerField( default=0)
    callcost =models.FloatField( default=0.0)
    callstatus=models.CharField(max_length=25,default='initiated')


