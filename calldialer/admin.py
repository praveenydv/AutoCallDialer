from django.contrib import admin
from .models import User,Phonebook,Contact,CallRecord
from .forms import NewUserCreationForm
from django.contrib.auth.admin import UserAdmin 

class NewUserAdmin(UserAdmin): 
    model=User
    add_form=NewUserCreationForm

    fieldsets=(
        *UserAdmin.fieldsets,
        (
            'Profile',
            {
                'fields':(
                    'dob',
                    'profile_image',
                )
            }
        )
    )

 
admin.site.register(User,NewUserAdmin) 
admin.site.register([Phonebook,Contact,CallRecord])


