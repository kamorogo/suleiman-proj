import os
from celery.schedules import crontab
from django.apps import apps
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LicenseRenew.settings")

app = Celery("LicenseRenew")

app.config_from_object('django.conf:settings', namespace='CELERY')

                ######---USECASE2---#####

app.conf.beat_schedule = {
    "send-reminders-daily": {
        "task": "LicenseTrack.tasks.send_software_reminder",
        "schedule": crontab(hour=0, minute=0),
    },
}



app.autodiscover_tasks()
