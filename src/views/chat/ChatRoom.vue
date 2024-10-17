<template>
    <v-container style="width: 70%; margin-top: 60px; margin-bottom: 20px;">
        <br>
        <br>
        <v-row justify="center">
            <v-col cols="4">
                <v-card  style="height: 650px;">
                    <v-card-title class="title-font-size">
                        채팅방 리스트
                    </v-card-title>
                    <v-card-text class="chat-list-scroll">
                        <v-card v-for="chatRoom in chatRoomList" :key="chatRoom.id"
                            :class="{ 'selected-chat-room': chatRoomId === chatRoom.chatRoomId, 'custom-border': true }"
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
                    <v-card-title class="title-font-size">
                        채팅방 선택하세요
                    </v-card-title>
                </v-card>
            </v-col>

            <v-col cols="8" v-else>
                <v-card class="chat-card">
                    <v-card-title class="title-font-size">
                        {{ chatRoomTitle }}
                    </v-card-title>

                    <v-card-text class="chat-content">
                        <v-row class="chat-messages">

                            <div class="chat-history" ref="chatHistory">
                                <div v-for="(msg, index) in chatHistory" :key="index" :class="getMessageClass(msg)">
                                    {{ msg.memberName }}
                                    <br>
                                    {{ msg.message }}
                                </div>
                            </div>
                        </v-row>


                    </v-card-text>
                    <v-card-actions>
                        <v-row class="chat-input mt-auto">
                            <v-col cols="9">
                                <input v-model="message" type="text" placeholder="Enter your message..."
                                    class="w-100 custom-input" @keydown.enter="sendMessage" />
                            </v-col>
                            <v-col cols="3">
                                <v-btn @click="sendMessage" class="w-100">Send Message</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>

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

            chatRoomList: [],


            connectionStatus: 'Disconnected',
            stompClient: null,
            message: '',
            chatHistory: [],
            lectureType: null,
            topic: '',

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

                this.stompClient.activate();
            }

        },

        disconnectWebSocket() {
            this.chatHistory = [];
            if (this.stompClient && this.stompClient.connected) {
                this.stompClient.deactivate();
                this.connectionStatus = 'Disconnected';
                console.log('Disconnected from the WebSocket');
            }
        },



        async showChatRoomList() {
            try {
                let params = {
                    chatRoomId: this.chatRoomId
                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/room/list`, { params });
                
                this.chatRoomList= response.data.result;
                if (this.$route.query.chatRoomId != '') {
                    console.log("정해짐");
                    this.setChatRoom(this.chatRoomList[0]);
                }

            } catch (e) {
                console.log(e);
            }
        },


        setChatRoom(chatRoom) {
            this.chatRoomId = chatRoom.chatRoomId;
            console.log("set chat Room id " + this.chatRoomId);
            if (chatRoom.lectureType === 'LESSON') {
                this.chatRoomTitle = chatRoom.chatRoomTitle + ' - ' + chatRoom.memberName;
            } else {
                this.chatRoomTitle = chatRoom.chatRoomTitle;
            }

        },

        changeChatRoom(chatRoom) {
            this.disconnectWebSocket();

            this.chatRoomId = chatRoom.chatRoomId;
            console.log("chatRoom = " + this.chatRoomId);
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
            //topic 구독
            this.stompClient.subscribe(this.topic, (message) => {
                console.log('Received message: ' + message.body);
                this.addToChatHistory(message.body);
            });

            // this.stompClient.publish({
            //     destination: `/pub/room/${this.chatRoomId}/entered`,
            //     body: JSON.stringify({ roomId: this.chatRoomId }),
            //     headers: {
            //         "Authorization": `Bearer ${localStorage.getItem('token')}`
            //     }
            // });
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
                    memberId: localStorage.getItem('id'),
                    memberName: localStorage.getItem('name')
                };

                this.stompClient.publish({
                    destination: `/pub/room/${this.chatRoomId}`,
                    body: JSON.stringify(chatMessage),
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });

                this.message = '';
            }
        },
        addToChatHistory(message) {
            let parsedMessage;

            try {
                // 메시지가 문자열 형태로 들어왔을 때 파싱
                parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
            } catch (error) {
                console.error("메시지 파싱 오류:", message, error);
                return;
            }

            // 메시지를 채팅이력에 추가
            this.chatHistory.push({
                memberName: parsedMessage.memberName,
                memberId: parsedMessage.memberId,
                message: parsedMessage.message
            });

            // 채팅 화면 스크롤을 자동으로 아래로
            this.$nextTick(() => {
                const chatHistoryElement = this.$refs.chatHistory;
                if (chatHistoryElement) {
                    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
                }
            });
        },
        getMessageClass(msg) {
            const currentUserId = localStorage.getItem('id');

            if (msg.memberId == currentUserId) {
                return 'chat-message sent';
            } else {
                return 'chat-message received';
            }
        },


    }
}
</script>
<style scoped>
.selected-chat-room {

    box-shadow: none !important;
    background-color: #6C97FD !important;
    color: white !important;
    margin-bottom: 10px;
    text-align: left;
}

.custom-border {
    border: 2px solid #D9D9D9;
    border-radius: 8px;
    box-shadow: none !important;
    background-color: #ffffff;
    margin-bottom: 10px;
    text-align: left;
}

.chat-card {
    height: 650px;
    width: 90%;
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 490px;
}



.chat-message {
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 20px;
    position: relative;
    max-width: 80%;
    word-wrap: break-word;
}

.sent {
    background-color: #6C97FD !important;
    color: white !important;
    align-self: flex-end;
    text-align: right;
    border-radius: 20px;
    position: relative;
    margin-left: auto;
}

.received {
    background-color: #f1f1f1;
    align-self: flex-start;
    text-align: left;
    border-radius: 20px;
    position: relative;
    margin-right: auto;
}

.sent::after {
    content: '';
    position: absolute;
    top: 10px;
    right: -8px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 0 8px 8px;
    border-color: transparent transparent transparent #6C97FD;
}

.received::after {
    content: '';
    position: absolute;
    top: 10px;
    left: -8px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 8px 0;
    border-color: transparent #f1f1f1 transparent transparent;
}


.chat-history {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 100%;
    padding: 10px;
    scrollbar-width: none;
}


.chat-message {
    padding: 5px 10px;
    margin-bottom: 5px;
    background-color: #f1f1f1;
    border-radius: 8px;
}


.chat-input {
    align-items: end;
}

.custom-input {
    height: 36px;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 4px;
}

.chat-list-scroll {
    height: calc(650px - 56px);
    overflow-y: auto; 
    padding: 10px;
    scrollbar-width: none;

  }


  .title-font-size{
    font-size: 30px;
    font-weight: bold;
  }
</style>
