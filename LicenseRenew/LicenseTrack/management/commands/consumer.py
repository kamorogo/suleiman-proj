from django.core.management.base import BaseCommand
import pika
import os
import django
import json
from django.core.mail import send_mail



os.environ.setdefault("DJANGO_SETTINGS_MODULE", "LicenseRenew.settings")
django.setup()

class Command(BaseCommand):


    def handle(self, *args, **options):
       
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        channel = connection.channel()

        channel.exchange_declare(exchange = 'license_exchange', exchange_type='direct', durable=True)
        channel.queue_declare(queue = 'license_queue', durable=True)
        channel.queue_bind(queue= 'license_queue', exchange='license_exchange', routing_key='license_renewal')


        def callback(ch, method, properties, body):
            print("Recieved message", body)
            data = json.loads(body)
            email = data['email']
            license_name = data['license_type']
            expiry_date = data['expiry_date']



            # Send Email Notification
            try:
                send_mail(
                    subject=f"Renewal Reminder: {license_name}",
                    message=f"Your '{license_name}' expires on {expiry_date}. Please renew it.",
                    from_email="alisuleimann4@gmail.com",
                    recipient_list=[email],
                )
                print(f" [✓] Sent renewal reminder to {email}")
                ch.basic_ack(delivery_tag=method.delivery_tag)
            
            except Exception as e:
                print(f" [X] Email failed for {email}: {str(e)}")
            

        print("Start:")    

        # Consume Messages from Queue
        channel.basic_consume(queue="license_queue", on_message_callback=callback, auto_ack=False)

        print("Start Consuming ... ")

        channel.start_consuming()


    