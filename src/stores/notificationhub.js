import { defineStore } from 'pinia';
import { useAppStatesStore } from '@/stores/appstates'
import * as signalR from '@microsoft/signalr';
import env from "@/env.js";

export const useNotificationHubStore = defineStore('notificationhub', {
    state: () => ({
        connection: null,
        notifications: null,
        lastUnread: 0,
        hasRegiterNoti: false,
        audio: new Audio('/sound.mp3')
    }),
    actions: {
        async start() {
            let self = this;
            if (self.connection === null) {
                self.connection = new signalR.HubConnectionBuilder()
                    .withUrl(env.VITE_SERVER_URL + "/notificationhub")
                    .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
                    .build()
            }
            try {
                await self.connection.start()
                console.log("Notification Connected.")
                if (useAppStatesStore().enableNoti && !self.hasRegiterNoti) {
                    self.connection.on("Notifications", (notis) => {
                        self.notifications = notis;
                        if (self.lastUnread != notis.unRead) {
                            let binder = setInterval(async () => {
                                if (self.audio.readyState === 4 && document.readyState === 'complete') {
                                    try { self.audio.play(); } catch { self.audio.play(); }
                                    clearInterval(binder);
                                }
                            }, 100)
                            self.lastUnread = notis.unRead;
                        }
                    });

                    self.connection.on("HasNotification", (type) => {
                        if (type === 'BANCHAOMOI')
                            {
                                useAppStatesStore().showCanhBaoBanChaoMoi = true;
                                useAppStatesStore().loadDanhSachBanChao();
                            }
                    });
                    self.hasRegiterNoti = true;
                }
                if (useAppStatesStore().user.username != null)
                    await self.connection.invoke("HubConnected", useAppStatesStore().user.username);
            } catch (err) {
                console.log(err)
            }

        }
    }
})

