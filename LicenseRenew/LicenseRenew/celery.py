import os
from celery.schedules import crontab
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LicenseRenew.settings")

app = Celery("LicenseRenew")
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()



###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE2---#####
app.conf.beat_schedule = {
    "send-reminders-daily": {
        "task": "LicenseTrack.tasks.check_expiry_license",
        "schedule": crontab(hour=0, minute=0),
    },
}


app.conf.beat_schedule = {
    "send-reminders-daily": {
        "task": "LicenseTrack.tasks.send_software_reminder",
        "schedule": crontab(hour=8, minute=0),
    },
}




###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################


                ######---USECASE1---#####
app.conf.beat_schedule = {
    'check-renewals-daily': {
        'task': 'LicenseTrack.tasks.send_renewal_reminder',
        'schedule': crontab(hour=0, minute=0),
    },
}

