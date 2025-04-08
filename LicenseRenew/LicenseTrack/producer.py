import os
import pika
import json
from datetime import datetime
from django.utils.timezone import timedelta
from .models import Subscription


def send_renewal_message():

    today = datetime.strptime('2026-02-10', '%Y-%m-%d').date() #now().date()
    reminder_days = [30, 15, 7, 1]

    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        channel = connection.channel()

        channel.exchange_declare(exchange = 'license_exchange', exchange_type='direct', durable=True)
        channel.queue_declare(queue = 'license_queue', durable=True)
        channel.queue_bind(queue='license_queue', exchange='license_exchange', routing_key='license_renewal')

        for days in reminder_days:
            target_date = today + timedelta(days=days)
            print("Target Field:", target_date)
            licenses = Subscription.objects.filter(expiry_date__date=target_date)

            for license_obj in licenses:
                message = {
                    "license_type": license_obj.subscription_type,
                    "expiry_date": license_obj.expiry_date.date().isoformat(),
                    "email": license_obj.users.email,
                }

                channel.basic_publish(
                    exchange="license_exchange",
                    routing_key="license_renewal",
                    body=json.dumps(message),
                    properties=pika.BasicProperties(delivery_mode=2)
                    )
        
        print("Message published successfully ..........")

        connection.close()
        return f"Renewal reminders sent successfully for {today}"
    
    except pika.exceptions.AMQPConnectionError as e:
        print(f" [X] Failed to connect to RabbitMQ: {str(e)}")




