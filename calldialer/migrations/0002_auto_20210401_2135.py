# Generated by Django 3.1.7 on 2021-04-01 21:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('calldialer', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='callrecord',
            name='callendtime',
        ),
        migrations.AddField(
            model_name='callrecord',
            name='callsid',
            field=models.CharField(default='xxxxxxxxxxx', max_length=50),
        ),
        migrations.AddField(
            model_name='callrecord',
            name='callstatus',
            field=models.CharField(default='initiated', max_length=25),
        ),
        migrations.AlterField(
            model_name='callrecord',
            name='callcost',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='callrecord',
            name='callduration',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='callrecord',
            name='contact',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='contact', to='calldialer.contact'),
        ),
        migrations.AlterField(
            model_name='callrecord',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='cr_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='contact',
            name='city',
            field=models.CharField(default='City', max_length=25),
        ),
        migrations.AlterField(
            model_name='contact',
            name='fname',
            field=models.CharField(default='Fname', max_length=25),
        ),
        migrations.AlterField(
            model_name='contact',
            name='lname',
            field=models.CharField(default='Lname', max_length=25),
        ),
        migrations.AlterField(
            model_name='contact',
            name='pnumber',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='phonebook',
            name='pbname',
            field=models.CharField(default='Phonebook', max_length=30),
        ),
    ]
