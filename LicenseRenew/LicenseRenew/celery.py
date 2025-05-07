
from __future__ import absolute_import, unicode_literals
from celery.schedules import crontab
from django.apps import apps
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LicenseRenew.settings")

app = Celery("LicenseRenew")

app.config_from_object('django.conf:settings', namespace='CELERY')


app.conf.beat_schedule = {
    "send-reminders-daily": {
        "task": "LicenseTrack.tasks.send_software_reminder",
        "schedule": crontab(hour=10, minute=0),
    },
}


app.conf.beat_schedule = {
    "send-reminders-daily": {
        "task": "LicenseTrack.tasks.send_subscription_reminder",
        "schedule": crontab(hour=10, minute=0),
    },
}



app.autodiscover_tasks()



