# Generated by Django 3.1.7 on 2021-04-01 23:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('calldialer', '0002_auto_20210401_2135'),
    ]

    operations = [
        migrations.AlterField(
            model_name='callrecord',
            name='contact',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='contact', to='calldialer.contact'),
        ),
        migrations.AlterField(
            model_name='callrecord',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cr_user', to=settings.AUTH_USER_MODEL),
        ),
    ]