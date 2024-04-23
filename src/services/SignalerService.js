import { useChatHubStore } from '@/stores/chathub';
import env from "@/env.js";

export default {
    startConnection(username) {
        console.log("Connected to chathub: " + env.VITE_SERVER_URL)
        useChatHubStore().connection.invoke("Login", username).catch((err) => console.error('Error while Login: ', err));
    },
    disconnect() {
        useChatHubStore().connection
            .stop()
            .then(() => {
                console.log("Disconnected chathub")
            })
            .catch((err) => console.error('Error while disconnect: ', err));
    },
    onReceiveMessage(callback) {
        useChatHubStore().connection.on('ReceiveMessage', (message) => {
            callback(message);
        });
    },
    subToMessage(key, callback) {
        useChatHubStore().connection.on(key, (message) => {
            callback(message);
        });
    },
    pubToMessage(key, message) {
        useChatHubStore().connection.invoke(key, message)
            .catch((err) => console.error('Error while sending message: ', err));
    },
    SendMessageToGroup(sender, receiver, message) {
        useChatHubStore().connection.invoke("SendMessageToGroup", sender, receiver, message)
            .catch((err) => console.error('Error while sending message to group: ', err));
    },
    CreateConversion(roomId, roomName, avatar, users) {
        useChatHubStore().connection.invoke("CreateConversion", roomName, roomId, avatar, users)
            .catch((err) => console.error('Error while create conversion: ', err));
    },
    ReadMessage(id) {
        useChatHubStore().connection.invoke("ReadMessage", id)
            .catch((err) => console.error('Error while sending message: ', err));
    },
};
