# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User
from tictactoe.tests import write_to_log

from channels.layers import get_channel_layer

import json


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        # text_data_json = json.loads(text_data)

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'send_smth',
                'json_str': text_data
            }
        )
        layer = get_channel_layer()
        async_to_sync(layer.group_send)('chat_test', {
            'type': 'send_smth',
            'json_str': text_data
        })

    # Receive message from room group
    def send_smth(self, event):

        # Send message to WebSocket
        self.send(text_data=event["json_str"])

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def get_name(self):
        return User.objects.all()[0].username