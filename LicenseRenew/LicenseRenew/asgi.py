
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from LicenseTrack import consumer
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LicenseRenew.settings')
application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/notifications/', consumer.NotificationConsumer.as_asgi()),
        ])
    ),
})