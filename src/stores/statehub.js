import { defineStore } from 'pinia'
import * as signalR from '@microsoft/signalr'
import { useAppStatesStore } from '@/stores/appstates'
import env from "@/env.js";
export const useStateHubStore = defineStore('statehub', {
    state: () => ({
        connection: null,
        factories: [],//nhà máy - tổ máy   
        factorieBanChaos: [],     
        lakes: [],//hồ nước
        regions: [],//vùng miền
        sourcesTypes: [],//loại hình phát điện
        functions: null,//danh sách chức năng,
    }),
    actions: {
        async start() {
            let self = this;
            if (self.connection === null) {
                self.connection = new signalR.HubConnectionBuilder()
                    .withUrl(env.VITE_SERVER_URL + "/statehub")
                    .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
                    .build()
            }
            try {
                await self.connection.start()
                console.log("State Connected.")
                //subcriber here
                self.connection.on("Functions", (functions) => { 
                    self.functions = functions; 
                    useAppStatesStore().updateMenu();
                });
                self.connection.on("Regions", (regions) => { self.regions = regions; });
                self.connection.on("SourcesTypes", (sourcesTypes) => { self.sourcesTypes = sourcesTypes; });
                self.connection.on("Factories", (factories) => { self.factories = factories; });
                self.connection.on("Lakes", (lakes) => { self.lakes = lakes; });
                self.connection.on("FactorieBanChaos", (factorieBanChaos) => { self.factorieBanChaos = factorieBanChaos; });

                let token = localStorage.getItem('authen.token.value');
                if (token)
                    await self.connection.invoke("HubConnected", localStorage.getItem('authen.username'));
                else
                    await self.connection.invoke("HubConnected", null);
            } catch (err) {
                console.log(err)
            }
        },

    }
})

