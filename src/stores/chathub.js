import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import { useAppStatesStore } from '@/stores/appstates'
import env from "@/env.js";

export const useChatHubStore = defineStore('chathub', {
    state: () => ({
        connection: null,
        unreadMessage: 0,
        audio: new Audio('/sound.mp3')
    }),
    actions: {
        async start() {

            let self = this;

            if (self.connection === null) {
                self.connection = new signalR.HubConnectionBuilder()
                    .withUrl(env.VITE_SERVER_URL + "/chathub")
                    .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
                    .configureLogging(signalR.LogLevel.Information)
                    .build()
            }
            try {
                await self.connection.start()
                console.log("Chathub Connected.")
                self.connection.on("HasMessage", async (obj) => {
                    let localCount = parseInt(localStorage.getItem('message_count'));
                    self.unreadMessage = obj.total;
                    if (localCount != obj.total) {
                        let binder = setInterval(async () => {
                            if (document.readyState !== 'complete') return;
                            try { self.audio.play(); } catch { }
                            clearInterval(binder);
                        }, 100)
                    }
                    localStorage.setItem('message_count', obj.total);
                });
                if (useAppStatesStore().user.username != null) {
                    await self.connection.invoke("Login", useAppStatesStore().user.username).catch((err) => console.error('Error while Login: ', err));
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
})

