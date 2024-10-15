<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="4">
                <v-card>
                    <v-card-title>
                        채팅방 리스트
                    </v-card-title>
                    <v-card-text>
                        <v-card v-for="chatRoom in chatRoomList" :key="chatRoom.id" class="custom-border text-left"
                            @click="changeChatRoom(chatRoom)">
                            <v-card-title>
                                <v-chip v-if="chatRoom.lectureType === 'LESSON'" color="primary"
                                    class="mr-2">과외</v-chip>
                                <v-chip v-else color="primary" class="mr-2">강의</v-chip>
                                {{ chatRoom.chatRoomTitle }}
                            </v-card-title>
                            <v-card-text>
                                {{ chatRoom.memberName }}
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="8" v-if="chatRoomId === null || chatRoomId === ''">
                <v-card class="chat-card">
                    <v-card-title>
                        채팅방 선택하세요
                    </v-card-title>
                </v-card>
            </v-col>

            <v-col cols="8" v-else>
                <v-card class="chat-card">


                    <v-card-title>
                        {{ chatRoomTitle }}
                    </v-card-title>

                    <v-card-text class="chat-content">
                        <v-row class="chat-messages">

                            <div class="chat-history">
                                <div v-for="(msg, index) in chatHistory" :key="index" class="chat-message">
                                    {{ msg }}
                                </div>
                            </div>
                        </v-row>



                        <v-row class="chat-input mt-auto">
                            <v-col cols="9">
                                <input v-model="message" type="text" placeholder="Enter your message..."
                                    class="w-100 custom-input" />
                            </v-col>
                            <v-col cols="3">
                                <v-btn @click="sendMessage" class="w-100">Send Message</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
export default {
    data() {
        return {
            chatRoomId: this.$route.query.chatRoomId,
            chatRoomTitle: '',
            size: 5,
            page: 0,
            chatRoomList: [],


            connectionStatus: 'Disconnected',
            stompClient: null,
            message: '',
            chatHistory: [],
            // role: localStorage.getItem('role'),
            lectureType: null,
            topic: '',
            // lectureGroupId: 4,
            // memberId: localStorage.getItem('id'),

        };

    },
    created() {
        this.showChatRoomList();
        this.connectWebSocket();


    },

    methods: {

        connectWebSocket() {
            if (this.chatRoomId != '') {
                const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/ws/chat`);
                this.stompClient = new StompClient({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    onConnect: this.onConnected,
                    onStompError: this.onError
                });

                // Connect to WebSocket
                this.stompClient.activate();
            }

        },

        disconnectWebSocket() {
            this.chatHistory = [];
            if (this.stompClient && this.stompClient.connected) {
                this.stompClient.deactivate(); // Deactivate the current connection
                this.connectionStatus = 'Disconnected';
                console.log('Disconnected from the WebSocket');
            }
        },



        async showChatRoomList() {

            try {
                let params = {
                    chatRoomId: this.chatRoomId,
                    size: this.size,
                    page: this.page,

                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/room/list`, { params });
                this.chatRoomList = response.data.result.content;

            } catch (e) {
                console.log(e.response.data.error_message);
            }



        },

        changeChatRoom(chatRoom) {
            this.disconnectWebSocket();
            

            this.chatRoomId = chatRoom.chatRoomId;
            if (chatRoom.lectureType === 'LESSON') {
                this.chatRoomTitle = chatRoom.chatRoomTitle + ' - ' + chatRoom.memberName;
            } else {
                this.chatRoomTitle = chatRoom.chatRoomTitle;
            }
            this.connectWebSocket();
        },

        async onConnected(frame) {
            this.connectionStatus = 'Connected';
            console.log('Connected: ' + frame);

            this.topic = '/topic/chat-' + this.chatRoomId;
            console.log("topic:" + this.topic);
            // Subscribe to the chatroom topic
            this.stompClient.subscribe(this.topic, (message) => {
                console.log('Received message: ' + message.body);
                this.addToChatHistory(message.body);
            });

            this.stompClient.publish({
                destination: `/pub/room/${this.chatRoomId}/entered`,
                body: JSON.stringify({ roomId: this.chatRoomId }),
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
        },
        onError(error) {
            this.connectionStatus = 'Disconnected';
            console.error('Connection error: ' + error);
        },
        sendMessage() {
            if (this.stompClient && this.stompClient.connected && this.message.trim() !== '') {
                const chatMessage = {
                    chatRoomId: this.chatRoomId,
                    message: this.message,
                    memberId: localStorage.getItem('id')
                };

                this.stompClient.publish({
                    destination: `/pub/room/${this.chatRoomId}`,
                    body: JSON.stringify(chatMessage),
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Optionally, add the sent message to the chat history
                // this.addToChatHistory(`You: ${this.message}`);

                // Clear the input box after sending
                this.message = '';
            }
        },
        // Add a message to the chat history
        addToChatHistory(message) {
            this.chatHistory.push(message);
        }


    }
}
</script>
<style scoped>
.custom-border {
    border: 2px solid #D9D9D9;
    border-radius: 8px;
    box-shadow: none !important;
    background-color: #D9D9D9;
    margin-bottom: 10px;
}

/* Set a fixed height for the chat card */
.chat-card {
    height: 540px;
    display: flex;
    flex-direction: column;
}

/* Flexbox to make the message area grow and input stay at the bottom */
.chat-content {
    flex: 1;
    /* The content area will expand to fill the space */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    /* Scroll when messages overflow */
}

.chat-input {
    align-items: end;
}

.custom-input {
    height: 36px;
    /* Adjust this value to match the button height */
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 4px;
}
</style>
