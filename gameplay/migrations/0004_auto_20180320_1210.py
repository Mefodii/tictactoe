# Generated by Django 2.0.2 on 2018-03-20 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gameplay', '0003_auto_20180314_1634'),
    ]

    operations = [
        migrations.AlterField(
            model_name='move',
            name='by_first_player',
            field=models.BooleanField(editable=False),
        ),
    ]
