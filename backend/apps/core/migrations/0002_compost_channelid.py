# Generated by Django 5.1.2 on 2024-10-26 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='compost',
            name='channelId',
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
    ]
