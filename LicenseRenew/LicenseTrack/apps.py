from django.apps import AppConfig


class LicensetrackConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'LicenseTrack'

    def ready(self):
        from . import signals