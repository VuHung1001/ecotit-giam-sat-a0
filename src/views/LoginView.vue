<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import Api from '../commons/basehttp';
import { useAppStatesStore } from '@/stores/appstates'
import { useStateHubStore } from '@/stores/statehub'
import router from "@/router";
const toast = useToast();


var login = ref({
    data: {
        username: '',
        password: '',
        rememberMe: false
    },
    action: {
        login: {
            label: 'ĐĂNG NHẬP',
            iconLabel: 'pi pi-check',
            icon: 'pi pi-plus-circle',
            cmd: async function () {
                useAppStatesStore().showLoading = true;
                await Api.post('authen/login', login.value.data)
                    .then(async response => {
                        if (response.data.success) {
                            useAppStatesStore().user.username = response.data.data.username;
                            useAppStatesStore().user.displayName = response.data.data.displayName;
                            useAppStatesStore().user.donVi = response.data.data.donVi;

                            let user = useAppStatesStore().menuUsers.find(function (t) {
                                return t.code == 'PROFILE'
                            })
                            if (user != null) {
                                user.label = response.data.data.displayName;
                            }

                            let logout = useAppStatesStore().menuUsers.find(function (t) {
                                return t.code == 'LOGOUT'
                            })
                            if (logout != null) {
                                logout.visible = true;
                            }
                            localStorage.setItem("authen.username", response.data.data.username);
                            localStorage.setItem("authen.donVi", response.data.data.donVi);
                            localStorage.setItem("authen.displayName", response.data.data.displayName);
                            localStorage.setItem("authen.token.value", response.data.data.token);
                            localStorage.setItem("authen.token.refresh", response.data.data.refreshToken);
                            router.push({ name: 'dashboard' })
                            localStorage.setItem("login.rememberme.value", login.value.data.rememberMe ? "T" : "F")
                            await useStateHubStore().connection.invoke("HubConnected", localStorage.getItem('authen.username'));
                            toast.add({ severity: 'success', summary: 'Trạng thái', detail: 'Đăng nhập thành công', life: 3000 });
                        }
                        else {
                            localStorage.setItem("authen.token.value", '')
                            localStorage.setItem("authen.token.refresh", '')
                            toast.add({ severity: 'error', summary: 'Trạng thái', detail: 'Đăng nhập không thành công', life: 3000 });
                        }
                        useAppStatesStore().showLoading = false;
                    })
                    .catch(error => {
                        useAppStatesStore().showLoading = false;
                        toast.add({ severity: 'error', summary: 'Trạng thái', detail: 'Đăng nhập không thành công', life: 3000 });
                    });
            }
        },
        forgotPass: {
            label: 'ĐĂNG NHẬP',
            iconLabel: 'pi pi-check',
            icon: 'pi pi-plus-circle',
            cmd: function () {
            }
        },
        keypress: function (e) {
            if (e.code == 'Enter') {
                login.value.action.login.cmd();
            }
        }
    }
})

</script>
<template>
    <div class="custom-backround w-full m-0">
        <Card class="w-30rem  bottom-50 left-50 absolute custom-login-css ">
            <template #title> Đăng nhập </template>
            <template #content>
                <div class="flex flex-column gap-2 w-full mt-4">
                    <label for="username">Tên đăng nhập <label class="text-red-500">*</label></label>
                    <InputText id="username" v-model="login.data.username" @keypress="login.action.keypress"
                        icon="pi pi-user" />
                </div>
                <div class="flex flex-column gap-2 w-full mt-4">
                    <label for="password">Mật khẩu <label class="text-red-500">*</label></label>
                    <Password v-model="login.data.password" toggleMask :feedback="false" class="w-full" :pt="{
                        input: {
                            class: 'w-full'
                        }
                    }" @keypress="login.action.keypress">
                    </Password>
                </div>
                <div class="flex  flex-column flex-wrap justify-content-center w-full mt-4 ">
                    <div class="flex align-items-center">
                        <Checkbox v-model="login.data.rememberMe" inputId="ingredient3" :binary="true" />
                        <label for="ingredient3" class="ml-2">Ghi nhớ đăng nhập</label>
                    </div>
                </div>
                <div class="flex flex-column gap-2 w-full mt-4">
                    <Button :label="login.action.login.label" icon="pi pi-check" @click="login.action.login.cmd" />
                </div>
            </template>
        </Card>
    </div>
</template>
<style>
.custom-backround {
    background-image: url('/src/assets/img/login-bg.svg');
    background-repeat: no-repeat;
    height: 100vh;
    background-size: contain;
}

.custom-login-css {
    transform: translate(50px, 225px);
}

@media screen and (max-width: 1000px) {
    .custom-login-css {
        transform: translate(-210px, 225px);
    }
}
</style>