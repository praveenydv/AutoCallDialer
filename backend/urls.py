
from django.conf.urls import include,url
from django.urls import path,re_path
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView
from .views import  FrontendAppView
from django.views.decorators.cache import never_cache
import rest_auth

urlpatterns = [
    path('superuser/admin/', admin.site.urls),
    path('rest-auth/', include('rest_auth.urls')),
    path('api/', include('calldialer.api.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
