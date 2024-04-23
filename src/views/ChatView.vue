
<script>
import { register } from 'vue-advanced-chat';
import { useAppStatesStore } from '@/stores/appstates';
import Api from '@/commons/basehttp';
import env from "@/env.js";
import SignalRService from '../services/SignalerService';
import { useChatHubStore } from '@/stores/chathub';
import * as signalR from '@microsoft/signalr';
register()
function genId() {
    var digits = '0123456789qwertyuiopasdfghjklzxcvbnm';
    let rs = '';
    for (let i = 0; i < 5; i++) {
        rs += digits[Math.floor(Math.random() * 10)];
    }
    return rs;
}
export default {
    data() {
        return {
            addMember: false,
            searchUser: "",
            chatHeight: "400px",
            user: {},
            users: [],
            loadingRooms: false,
            roomId: "",
            room: {},
            roomActions: [
                // { name: 'inviteUser', title: 'Thêm người' },
                // { name: 'removeUser', title: 'Xóa người' },
                // { name: 'deleteRoom', title: 'Xóa nhóm' }
            ],
            roomAdd: {
                roomId: '',
                roomName: '',
                avatar: '',
                users: [],
            },
            rooms: [],
            roomsLoaded: true,
            roomsOrder: 'desc',
            messages: [],
            messagesLoaded: false,
            messagesActions: [
                // {
                //     name: 'replyMessage',
                //     title: 'Trả lời'
                // },
                // {
                //     name: 'selectMessages',
                //     title: 'Chọn'
                // }
            ],
            menuActions: [
                // { name: 'inviteUser', title: 'Thêm người' },
                // { name: 'removeUser', title: 'Xóa người' },
                { name: 'deleteRoom', title: 'Xóa' }
            ],
            infoForm: false,
            createForm: false,
            isRandomUser: true,
        }
    },

    methods: {
        fetchMessages({ options, room }) {
            var self = this;
            room.files = []
            this.room = room;
            this.messagesLoaded = false;
            this.messages = [];
            Api.get(env.VITE_SERVER_URL + "/api/system/chat/" + room.roomId)
                .then(function (result) {
                    self.messages = result.data.map(e => {
                        if (!!e.files) {
                            e.files = JSON.parse(e.files)
                            e.files = e.files.map(e => { return { ...e, progress: -1 } })
                            self.room.files.push(...e.files)
                        }
                        SignalRService.ReadMessage(e._id)
                        return e
                    })
                    self.messagesLoaded = true
                })
                .catch(function (error) {
                    console.log("error:", error);
                });
            SignalRService.pubToMessage("JoinRoom", room.roomId)

        },

        sendMessage(message) {
            try {

                if (message.files) {
                    var formData = new FormData();
                    message.files.forEach(async file => {
                        formData.append("files", file.blob, file.name + "." + file.extension);
                    });
                    const url = env.VITE_SERVER_URL + '/api/system/chat/upload';
                    const fetchOptions = {
                        method: 'post',
                        body: formData,
                    };
                    Api.post(url, fetchOptions).then(rs => {
                        message.files = JSON.stringify(rs.data);
                        SignalRService.SendMessageToGroup(this.user._id, message.roomId, message)
                    }).catch(err => {
                        if (err.status == 405)
                            console.log({
                                type: 'error',
                                message: "Tệp tin chưa được cấp phép, vui lòng liên hệ admin"
                            })
                        return;
                    });
                } else {
                    SignalRService.SendMessageToGroup(this.user._id, message.roomId, message)
                }
            } catch (error) {
            }
        },

        onClickedHeader(ev) {

            if (this.room._id != "") {
                const currentUsers = this.room.users
                this.room.withOutUsers = this.users.filter(user => !currentUsers.some(e => e._id == user._id))
            }
            this.room = ev;
            this.infoForm = true;
        },

        onAddRoom() {
            let room = JSON.parse(JSON.stringify(this.roomAdd))
            if (this.roomAdd.roomName == '') {
                document.getElementById("roomAdd.roomName").focus();
                return
            }
            if (this.roomAdd.users.length == 0) {
                return
            }
            let currentUser = this.user
            room.users.push(currentUser)
            SignalRService.CreateConversion(genId(), room.roomName, room.avatar, JSON.stringify(room.users))
            this.createForm = false
            this.roomAdd = {}
        },
        onUpdateRoom() {
            let room = JSON.parse(JSON.stringify(this.room))
            SignalRService.pubToMessage("UpdateConversion", room)
            this.addMember = false
            this.infoForm = false
        },

        chatNow(user) {
            const roomAdd = {};
            roomAdd.roomName = user.username;
            roomAdd.users = [user]
            let currentUser = this.user
            roomAdd.users.push(currentUser)
            const tmp = this.rooms.filter(r => r.users.sort(e => e._id).map(e => e._id).join("") == roomAdd.users.sort(e => e._id).map(e => e._id).join(""))
            let roomId = genId()
            if (tmp.length < 1) {
                SignalRService.CreateConversion(roomId, roomAdd.roomName, user.avatar, JSON.stringify(roomAdd.users))
                this.rooms.push({
                    "roomId": roomId,
                    "roomName": roomAdd.roomName,
                    "avatar": env.VITE_SERVER_URL + '/api/system/chat/avatar/' + currentUser.fullName,
                    "lastMessage": null,
                    "users": roomAdd.users
                })
            } else {
                this.room = tmp[0];
                roomId = tmp[0].roomId;
            }
            this.roomAdd = {};
            this.createForm = false;
            this.roomId = roomId;
        },

        onUpdate(event) {
            const file = event.target.files[0];

            var formData = new FormData();
            formData.append("files", file);
            const url = env.VITE_SERVER_URL + '/api/system/chat/upload';
            const fetchOptions = {
                method: 'post',
                body: formData,
            };

            Api.post(url, fetchOptions).then(rs => {
                this.room.avatar = rs.data[0].url;
                SignalRService.pubToMessage("UpdateConversion", this.room)
            });

        },
        onUpload(event) {
            const file = event.target.files[0];
            var formData = new FormData();
            formData.append("files", file);
            const url = env.VITE_SERVER_URL + '/api/system/chat/upload';
            const fetchOptions = {
                method: 'post',
                body: formData,
            };

            Api.post(url, fetchOptions).then(rs => {
                this.roomAdd.avatar = rs[0].url;
            });
        },
        onClickTo(isUpload) {
            // Trigger a click event on the hidden file input
            isUpload ? this.$refs.updateRoomAvatarInput.click()
                :
                this.$refs.uploadRoomAvatarInput.click();
        },

        menuActionHandler({ action, roomId }) {
            switch (action.name) {
                case 'inviteUser':
                    this.infoForm = true;
                    return this.inviteUser(roomId)
                case 'removeUser':
                    return this.removeUser(roomId)
                case 'deleteRoom':
                    return this.deleteRoom(roomId)
            }
        },
        deleteRoom(roomId) {
            SignalRService.pubToMessage("DeleteConversion", roomId)
        },
        loadUsers() {
            var self = this
            Api.get("/system/user/getpage?pageSize=15&keyword=" + this.searchUser)
                .then(response => {
                    const data = response.data.data.items.map(e => { return { _id: e.username, username: e.displayName, fullName: e.displayName, avatar: !!e.avatar ? e.avatar : `${env.VITE_SERVER_URL}/api/system/chat/avatar/${e.displayName}`, teN_DV: e.teN_DV } })
                    self.users = data
                })
                .catch(e => {
                    // self.updateMenu()
                    // useNotificationHubStore().toast({
                    //     type: 'error',
                    //     message: e.message
                    // })
                })
        },
        openFile({ message, file }) {
            window.open(file.file.url, '_blank')
        }

    },
    async mounted() {
        let self = this;
        self.loadUsers("");
        self.user = {
            _id: useAppStatesStore().user.username,
            username: useAppStatesStore().user.displayName,
            fullName: useAppStatesStore().user.displayName,
        }
        let binder = setInterval(async () => {
            //load function 
            if (useChatHubStore().connection.state == signalR.HubConnectionState.Connected) {
                await SignalRService.startConnection(self.user._id);
                SignalRService.onReceiveMessage((message) => {
                    if (self.room._id == message.convertionId)
                        self.messages.push(message);
                    if (!!message.files) {
                        message.files = JSON.parse(message.files)
                    }
                    self.room.lastMessage = message;
                    let index = self.rooms.findIndex(e => e._id == message.convertionId);
                    self.rooms[index].lastMessage = message
                });
                SignalRService.subToMessage("NewGroup", (room) => {
                    self.rooms.push(room)
                });
                SignalRService.subToMessage("UpdateGroup", (room) => {
                    self.room = room;
                    let index = self.rooms.findIndex(e => e.roomId == room.roomId);
                    if (index < 0) {
                        self.rooms.push(room)
                    } else {
                        self.rooms[index] = room;
                    }
                    self.roomId = room.roomId;
                });
                SignalRService.subToMessage("DeleteGroup", (roomId) => {
                    let index = self.rooms.findIndex(e => e.roomId == roomId);
                    if (index > 0) {
                        self.rooms.splice(index, 1);
                    }
                });

                SignalRService.subToMessage("Notification", (content) => {
                    console.error("🚀 ~ file: ChatView.vue:187 ~ SignalRService.subToMessage ~ content:", content)
                });


                useAppStatesStore().navbars = [{
                    icon: 'pi pi-fw pi-file',
                    label: 'Chat box (' + self.user.username + ')',
                    route: '/chat',
                    visible: true
                }]
                SignalRService.subToMessage("ListConversions", (rs) => {

                    self.rooms = rs.map(r => {
                        if (!!r.avatar)
                            return r
                        else {
                            r.avatar = `${env.VITE_SERVER_URL}/api/system/chat/avatar/${r.roomName}`
                            return r;
                        }
                    })
                });
                clearInterval(binder);
            }
        }, 100);



        this.chatHeight = (window.innerHeight - 80) + 'px';

    },
    watch() {
        this.chatHeight = (window.screen.height - 80) + 'px';
    },
    computed: {
        theme() {
            return useAppStatesStore().themeMode == 'dark-mode' ? 'dark'

                : 'light';
        }
    }
}

</script>
  
<style lang="css">
.list-media {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
}

.list-file {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.list-link {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
}

.member {
    margin-bottom: 15px;
}

.member-list {
    padding: 10px 20px;
}

.action-more {
    display: flex;
    flex-direction: column;
    text-align: start;
    gap: 10px;
}

.action-more {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
}

.action-more a {
    padding: 15px;
}

.member-item {
    display: flex;
    justify-content: space-between;
}
</style>



<template>
    <div>
        <vue-advanced-chat class="vue-chat" :room-id="roomId" :height="chatHeight" :current-user-id="user._id"
            :loading-rooms="loadingRooms" :load-first-room="false" :room-actions="JSON.stringify(roomActions)"
            :rooms="JSON.stringify(rooms)" :rooms-loaded="roomsLoaded" :rooms-order="roomsOrder"
            :menu-actions="JSON.stringify(menuActions)" :message-actions="JSON.stringify(messagesActions)"
            :messages="JSON.stringify(messages)" :messages-loaded="messagesLoaded" :responsive-breakpoint="900"
            :room-info-enabled="true" :theme="theme" @room-info="onClickedHeader($event.detail[0])"
            @send-message="sendMessage($event.detail[0])" @fetch-messages="fetchMessages($event.detail[0])"
            @add-room="createForm = true" @room-action-handler="menuActionHandler($event.detail[0])"
            @menu-action-handler="menuActionHandler($event.detail[0])" @open-file="openFile($event.detail[0])" />

        <Dialog v-model:visible="createForm" header="Tạo nhóm chat" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :position="position" :modal="true" :draggable="false">
            <div style="display: flex;align-items: center;">
                <div style="width: 20%;">
                    <img :src="!!roomAdd.avatar ? roomAdd.avatar : 'src/assets/img/logo.png'"
                        style="width: 70px;height: 70px;border-radius: 50%; display: block;margin: auto;cursor: pointer;"
                        :alt="roomAdd.roomName" v-on:click="onClickTo(false)">
                    <input ref="uploadRoomAvatarInput" style="display: none;" type="file" @change="onUpload"
                        accept="image/*">
                </div>
                <span class="p-float-label" style="width: 80%;">
                    <InputText id="roomAdd.roomName" v-model="roomAdd.roomName" aria-required="true" style="width: 100%;" />
                    <label for="roomAdd.roomName">Tên nhóm</label>
                </span>
            </div>

            <div style="border-top: 1px solid black; padding: 15px 0; margin: 15px 0;">

                <div style="display: flex;align-items: center;">
                    <span class="p-float-label" style="width: 100%;">
                        <InputText id="createForm.searchUser" aria-required="true" @change="loadUsers()"
                            v-model="searchUser" style="width: 100%;" />
                        <label for="createForm.searchUser">Tìm kiếm</label>
                    </span>
                </div>
                <ul style="list-style: none;height: 40vh;overflow: hidden; overflow-y: scroll; padding-right: 20px;">
                    <li v-for="(user, index) in users"
                        style="display: flex;gap:10px; align-items: center;padding: 5px 0; border-bottom: 1px dashed #cccccc42">
                        <input :id="user.username" :value="user" name="user" type="checkbox" v-model="roomAdd.users" />
                        <label :for="user.username" style="display: flex;">
                            <img width="35" height="35" style="border-radius: 50%;" :src="user.avatar" :alt="user.fullName">
                            <div style="display: flex;flex-direction: column;padding-left: 10px;">
                                <span>
                                    {{ user.username }}
                                    ({{ user._id }})
                                </span>
                                <span>Đơn vị: {{ user.tenDonVi }}</span>
                            </div>
                        </label>
                        <Button label="Chat" style="margin-left: auto; height: 20px;" @click="chatNow(user)" autofocus />

                    </li>
                </ul>
            </div>
            <Button label="Tạo" @click="onAddRoom()" autofocus />
            <Button label="Hủy" @click="createForm = false" text />
        </Dialog>


        <Dialog v-model:visible="addMember" header="Cập nhật" :style="{ width: '40rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :position="position" :modal="true" :draggable="false">
            <div style="display: flex;align-items: center;">
                <span class="p-float-label" style="width: 100%;">
                    <InputText id="room.searchUser" aria-required="true" @change="loadUsers()" v-model="searchUser"
                        style="width: 100%;" />
                    <label for="room.searchUser">Tìm kiếm</label>
                </span>
            </div>

            <div style="border-top: 1px solid black; padding: 15px 0; margin: 15px 0;">
                <ul style="list-style: none;">
                    <li v-for="(user, index) in users" style="display: flex; align-items: center;padding: 5px 0;">
                        <input :id="user.username" :value="user" name="user" type="checkbox" v-model="room.users" />
                        <label :for="user.username">
                            <span style="padding-left: 10px;">
                                {{ user.username }}
                                ({{ user._id }})
                            </span>
                        </label>
                    </li>
                </ul>
            </div>
            <Button label="Cập nhật" @click="onUpdateRoom()" autofocus />
            <Button label="Hủy" @click="addMember = false" text />
        </Dialog>


        <Dialog v-model:visible="infoForm" header="Thông tin nhóm" :style="{ width: '40rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :position="position" :modal="true" :draggable="false">
            <div style="text-align: center;">
                <img :src="room.avatar" style="width: 100px;height: 100px;border-radius: 50%; display: block;margin: auto;"
                    alt="" v-on:click="onClickTo(true)">

                <input ref="updateRoomAvatarInput" type="file" style="display: none;" @change="onUpdate" accept="image/*">

                <h1 style="margin: 20px 0;">{{ room.roomName }}</h1>
            </div>
            <Accordion :activeIndex="0">
                <AccordionTab v-if="room?.users?.length > 2" header="Thành viên">
                    <div class="member">
                        <h4 style="margin: 0;"> {{ room?.users?.length }} Thành viên</h4>

                        <div class="member-list">
                            <div v-for="user in room.users" class="member-item">
                                {{ user.username }}
                                {{ user._id == room.usernameAdmin ? "(admin)" : "" }}
                                <a href="#" v-on:click="removeUser(user._id)">Xóa</a>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex;gap: 10px;">
                        <Button label="Thêm" @click="addMember = true" />
                    </div>
                </AccordionTab>
                <AccordionTab header="Ảnh/Video">
                    <div class="media">
                        <div class="list-media">
                            <img v-for="e in room?.files?.filter(e => e.type.startsWith('image'))" :src="e.url"
                                :alt="e.url">
                        </div>
                        <!-- <Button label="Xem thêm" 
                            @click="" /> -->

                    </div>
                </AccordionTab>
                <AccordionTab header="File">
                    <div class="list-file">
                        <a v-for="e in room?.files?.filter(e => e.type.startsWith('application'))" :href="e.url"
                            target="_blank" style="display: flex;gap:10px;width: 100%;overflow: hidden;">
                            <img src="../assets/img/icon-10.png" height="40" :alt="e.name">
                            {{ e.name }}
                        </a>
                        <!-- <Button label="Xem thêm" 
                            @click="" /> -->

                    </div>
                </AccordionTab>
                <!-- <AccordionTab header="Link">
                    <div class="media">
                        <div class="list-link">
                            <a v-for="e in Array(10)" target="_blank"
                                href="https://picsum.photos/100/100?">https://picsum.photos/100/100?</a>
                        </div>
                        <Button label="Xem thêm" 
                        @click="" />

                    </div>
                </AccordionTab> -->
            </Accordion>
            <div class="action-more">
                <!-- <a href="#" target="_blank" rel="noopener noreferrer">Báo xấu</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Xóa chat</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Rời nhóm</a> -->
            </div>
        </Dialog>
    </div>
</template>
  