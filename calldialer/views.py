from django.shortcuts import render,get_object_or_404
from .models import User



def get_user(username):
    return get_object_or_404(User,username=username)

