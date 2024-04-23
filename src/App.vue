<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { RouterView } from 'vue-router'
import { useAppStatesStore } from '@/stores/appstates'
import { useNotificationHubStore } from '@/stores/notificationhub'
import { useChatHubStore } from '@/stores/chathub';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import TieredMenu from 'primevue/tieredmenu';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { usePrimeVue } from 'primevue/config';
import Sidebar from 'primevue/sidebar';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import env from '@/env.js';
const confirm = useConfirm();

const toast = useToast();
const PrimeVue = usePrimeVue();

const menu = ref();
const account = (event) => {
    menu.value.toggle(event);
};
const op = ref();
const notification = (event) => {
    op.value.toggle(event);
};
function message() {
    //router.push({ name: 'chat' });
    location.href = location.origin + '/chat';
}
function chatbot() {
    document.querySelector('#rasa-chat-widget-container button.large').click()
}

const router = useRouter();
const route = useRoute();


if (localStorage.getItem("theme-mode") == null || localStorage.getItem("theme-mode") == '') {
    localStorage.setItem("theme-mode", 'light-mode');

}
let currentTheme = '';
if (document.getElementById('theme-link').href.endsWith('dark-mode/theme.css')) {
    currentTheme = 'dark-mode';
}
else {
    currentTheme = 'light-mode';
}
if (currentTheme != localStorage.getItem("theme-mode"))
    PrimeVue.changeTheme(currentTheme, localStorage.getItem("theme-mode"), 'theme-link', () => { });

let theme = useAppStatesStore().menuUsers.find(function (t) {
    return t.code == 'THEME'
})
if (theme != null) {
    if (localStorage.getItem("theme-mode") == 'light-mode') {
        theme.label = 'Dark mode';
        theme.icon = 'pi pi-fw pi-moon';
    }
    else {
        theme.label = 'Light mode';
        theme.icon = 'pi pi-fw pi-sun';
    }
}

watch(
    () => route.fullPath,
    async () => {
        useAppStatesStore().sidebars.forEach(item => {
            let check = false;
            item.navbars.forEach(item => {
                if (route.path == router.resolve(item.route).path) {
                    check = true;
                    return;
                }
            });
            item.active = false;
            if (check) {
                item.active = true;
                useAppStatesStore().navbars = item.navbars;
                check = false;
            }
        });
        if (route.name == 'login') {
            if (document.getElementById('rasa-chat-widget-container') != null && document.getElementById('rasa-chat-widget-container') != undefined)
                document.getElementById('rasa-chat-widget-container').style.display = 'none';
        }
        else {

            if (document.getElementById('rasa-chat-widget-container') != null && document.getElementById('rasa-chat-widget-container') != undefined)
                document.getElementById('rasa-chat-widget-container').style.display = 'block';
        }
    }
);

onMounted(() => {

    if (useAppStatesStore().user.username == undefined || useAppStatesStore().user.username == null || useAppStatesStore().user.username == '') {
        router.push({ name: 'login' });
    }
    let binder = setInterval(() => {
        if (useAppStatesStore().sidebars != null && useAppStatesStore().sidebars.length > 0) {
            useAppStatesStore().sidebars.forEach(item => {
                let check = false;
                item.navbars.forEach(item => {
                    if (route.path == router.resolve(item.route).path) {
                        check = true;
                        return;
                    }
                });
                item.active = false;
                if (check) {
                    useAppStatesStore().navbars = item.navbars;
                    item.active = true;
                    check = false;
                }
            });
            clearInterval(binder);
        }
    }, 100);

    // useAppStatesStore().view.h = window.screen.height;
    // useAppStatesStore().view.w = window.screen.width;

    useAppStatesStore().view.h = window.innerHeight;
    useAppStatesStore().view.w = window.innerWidth;
    window.addEventListener("resize", resizeHandler);

})

onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
})
function resizeHandler() {
    // useAppStatesStore().view.h = window.screen.height;
    // useAppStatesStore().view.w = window.screen.width;

    useAppStatesStore().view.h = window.innerHeight;
    useAppStatesStore().view.w = window.innerWidth;
}
const sidebarVisible = ref(false);
function sidebar() {
    sidebarVisible.value = true;
}
function menuAction(code) {
    if (code == 'THEME') {
        let newMode = localStorage.getItem("theme-mode") == 'light-mode' ? 'dark-mode' : 'light-mode'
        PrimeVue.changeTheme(localStorage.getItem("theme-mode"), newMode, 'theme-link', () => {
            localStorage.setItem("theme-mode", newMode);
        });
        let theme = useAppStatesStore().menuUsers.find(function (t) {
            return t.code == code
        })
        if (theme != null) {
            if (newMode == 'light-mode') {
                theme.label = 'Dark mode';
                theme.icon = 'pi pi-fw pi-moon';
            }
            else {
                theme.label = 'Light mode';
                theme.icon = 'pi pi-fw pi-sun';
            }
        }
        useAppStatesStore().themeMode = newMode;
    }
    if (code == 'LOGOUT') {
        let user = useAppStatesStore().menuUsers.find(function (t) {
            return t.code == 'PROFILE'
        })
        let logout = useAppStatesStore().menuUsers.find(function (t) {
            return t.code == code
        })
        if (logout != null) {
            logout.visible = false;
        }
        if (user != null) {
            useAppStatesStore().user.username = '';
            useAppStatesStore().user.displayName = 'Dăng nhập';
            user.label = 'Đăng nhập';
            localStorage.setItem("authen.username", '');
            localStorage.setItem("authen.displayName", '');
            localStorage.setItem("authen.token.value", '');
            localStorage.setItem("authen.token.refresh", '');
            toast.add({ severity: 'success', summary: 'Trạng thái', detail: 'Đăng xuất công', life: 3000 });
            router.push({ name: 'login' });
        }
    }
    if (code == 'PROFILE') {
        if (useAppStatesStore().user.username == '') {
            router.push({ name: 'login' })
        }
    }
}

const BASE_SRC = ref(env.VITE_BASE_SRC)
function Check() {

    router.push({ name: 'giamsatbanchao_chuaguibanchao' })
}
async function ReadAllNoti() {
    confirm.require({
        message: 'Bạn có chắc muốn đánh dấu tất cả các tin thông báo là đã đọc?',
        header: 'Xác nhận',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Hủy',
        accept: async () => {
            await useNotificationHubStore().connection.invoke("ReadAllNoti", {
                userName: useAppStatesStore().user.username,
                index: useNotificationHubStore().notifications.index,
                pageSize: useNotificationHubStore().notifications.pageSize
            });
        },
    });
}
async function ReadNoti(id) {
    confirm.require({
        message: 'Bạn có chắc muốn đánh tin thông báo này là đã đọc?',
        header: 'Xác nhận',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Hủy',
        accept: async () => {
            await useNotificationHubStore().connection.invoke("ReadNoti", {
                userName: useAppStatesStore().user.username,
                index: useNotificationHubStore().notifications.index,
                pageSize: useNotificationHubStore().notifications.pageSize,
                notiId: id
            });
        },
    });
}
async function ChangeNotiPage(obj) {
    await useNotificationHubStore().connection.invoke("ChangeNotiPage", {
        userName: useAppStatesStore().user.username,
        index: obj.page,
        pageSize: obj.rows
    });
}
</script>
<template>
    <div></div>
    <Toast position="bottom-right" />
    <ConfirmDialog></ConfirmDialog>
    <div v-if="route.path === router.resolve('/login').path">
        <RouterView />
    </div>
    <div v-else>
        <div class="flex overflow-hidden">
            <div class="flex-none border-noround px-0"
                :style="'background-color:#1f40af;background-image: url(' + BASE_SRC + '/assets/img/background.png' + ');width:75px;margin-top: -1px;margin-left: -1px;'">
                <div class="justify-content-center py-3">
                    <img src="./assets/img/logo.png" class="block m-auto" width="50">
                </div>
                <ScrollPanel style="width: 100%; height: calc(100vh - 78px); background-color: transparent;">
                    <TieredMenu :model="useAppStatesStore().sidebars" class=" border-none w-full px-0"
                        style="background-color: transparent;">
                        <template #item="{ item }">
                            <router-link :to="item.router" :tooltip="'Enter your username'">
                                <div class="px-1 py-3 justify-content-center border-none border-bottom-1"
                                    v-tooltip="item.label" @click="sidebarVisible = false"
                                    :class="item.active ? 'active' : ''" style="border-color:rgba(255, 255, 255, 0.2);">
                                    <img :src="item.icon" class="block m-auto">
                                </div>
                            </router-link>
                        </template>
                    </TieredMenu>
                </ScrollPanel>
            </div>

            <div class="flex-grow-1">
                <Menubar :model="useAppStatesStore().navbars"
                    class="w-full border-none border-bottom-1 menu-bg shadow-1 border-bluegray-100 border-noround font-bold align-items-center justify-content-center">
                    <template #popupicon>
                        <i class="pi pi-angle-down"></i>
                    </template>
                    <template #start>
                        <Button icon="pi pi-list" severity="primary" aria-label="Cancel" class="mr-2"
                            @click="sidebar" />
                    </template>
                    <template #item="{ label, item }">
                        <router-link v-if="item.route" class="custom-navbar" :to="item.route">
                            <span class="block py-1 px-2 border-round-xl font-medium "
                                :class="route.path === router.resolve(item.route).path ? 'menu-button menu-text-color-active' : 'menu-text-color'">{{
        label }}</span>
                        </router-link>
                    </template>
                    <template #end>
                        <div class="flex">
                            <Button type="button" v-if="useAppStatesStore().enableChatbox" label="Chat nội bộ"
                                @click="message" severity="warning" :badge="useChatHubStore().unreadMessage"
                                class="mr-2" badgeClass="p-badge-danger" :pt="{
        root: {
            class: 'border-none',
            style: {
                background: '#FD955A',
                'height': '40px',
            }
        }
    }">
                                <template #icon>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="mr-2"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_1251_68)">
                                            <path
                                                d="M9.41406 0H10.5859C10.6354 0.0142546 10.6858 0.0249592 10.7367 0.0320315C12.1391 0.126953 13.4672 0.496094 14.6957 1.17422C17.5133 2.72969 19.2367 5.09336 19.8438 8.25977C19.9168 8.64062 19.9496 9.02891 20 9.41406V10.5859C19.9853 10.6413 19.9742 10.6975 19.9668 10.7543C19.8695 12.1496 19.5012 13.4715 18.827 14.6937C17.2719 17.5117 14.9082 19.2355 11.7422 19.8422C11.3609 19.9156 10.9715 19.9484 10.5859 19.9984H9.375C9.13711 19.9687 8.89922 19.943 8.66211 19.909C7.43633 19.7391 6.25161 19.348 5.16563 18.7547C5.07052 18.71 4.96252 18.701 4.86133 18.7293C4.38203 18.8715 3.90625 19.0301 3.43164 19.184C2.60013 19.4553 1.76875 19.7273 0.9375 20H0.625C0.478004 19.9542 0.344326 19.8734 0.235458 19.7645C0.12659 19.6557 0.0457884 19.522 0 19.375V19.0625C0.00898437 19.0535 0.0222656 19.0461 0.0257812 19.0352C0.437891 17.7492 0.846094 16.4621 1.26367 15.1777C1.28783 15.1159 1.29757 15.0493 1.29216 14.9831C1.28674 14.9169 1.26631 14.8528 1.23242 14.7957C0.68734 13.8175 0.31882 12.751 0.14375 11.6449C0.0902344 11.3059 0.0476563 10.9648 0 10.625V9.41406C0.0146654 9.35871 0.0257559 9.30248 0.0332031 9.2457C0.130469 7.85039 0.498828 6.52773 1.17188 5.30625C2.72695 2.48828 5.09062 0.764453 8.25664 0.157812C8.63906 0.0843747 9.02852 0.0515625 9.41406 0ZM1.99414 18.0078C2.83828 17.7367 3.64766 17.5102 4.43008 17.2141C4.97422 17.0078 5.41211 17.0812 5.91445 17.3656C7.7293 18.3902 9.68125 18.6812 11.7223 18.2559C13.8445 17.8129 15.548 16.6934 16.8195 14.9418C18.2746 12.9383 18.743 10.6996 18.2516 8.28047C17.8219 6.17109 16.7047 4.47695 14.9703 3.20547C12.9688 1.73359 10.7234 1.2418 8.30039 1.74531C5.63242 2.30039 3.68047 3.85234 2.44102 6.27031C1.62617 7.86328 1.39453 9.56523 1.67383 11.3352C1.84179 12.4109 2.22066 13.4429 2.78867 14.3719C2.96055 14.6543 2.99531 14.9348 2.88594 15.2461C2.75469 15.6199 2.63906 15.9992 2.51758 16.3766C2.34687 16.9066 2.17695 17.4367 1.99414 18.0062V18.0078Z"
                                                fill="white" />
                                            <path
                                                d="M7.0703 10.0066C7.06926 10.2003 7.01065 10.3893 6.90192 10.5496C6.79319 10.7099 6.63925 10.8342 6.45967 10.9068C6.28009 10.9794 6.08299 10.9969 5.89342 10.9572C5.70386 10.9175 5.53038 10.8223 5.39506 10.6837C5.25974 10.5451 5.16868 10.3694 5.13347 10.179C5.09825 9.98851 5.12046 9.79188 5.19728 9.61408C5.2741 9.43628 5.40206 9.28534 5.56489 9.18044C5.72771 9.07555 5.91805 9.02145 6.11171 9.02501C6.36788 9.03152 6.61139 9.13775 6.79042 9.32109C6.96946 9.50442 7.06987 9.75039 7.0703 10.0066Z"
                                                fill="white" />
                                            <path
                                                d="M9.02557 9.97421C9.03037 9.7805 9.09269 9.5926 9.2046 9.43442C9.3165 9.27623 9.47294 9.15491 9.65399 9.0859C9.83505 9.01688 10.0325 9.00329 10.2214 9.04685C10.4102 9.0904 10.5817 9.18914 10.7143 9.3305C10.8468 9.47186 10.9343 9.64945 10.9656 9.84067C10.9969 10.0319 10.9706 10.2281 10.89 10.4043C10.8095 10.5806 10.6783 10.7289 10.5133 10.8303C10.3482 10.9318 10.1567 10.9819 9.96307 10.9742C9.70731 10.9625 9.46621 10.8515 9.2911 10.6647C9.11599 10.4779 9.02072 10.2302 9.02557 9.97421Z"
                                                fill="white" />
                                            <path
                                                d="M14.8828 10.0094C14.8812 10.203 14.8221 10.3918 14.7129 10.5518C14.6037 10.7118 14.4495 10.8357 14.2697 10.9078C14.0899 10.9798 13.8928 10.9968 13.7034 10.9566C13.5139 10.9164 13.3407 10.8207 13.2058 10.6818C13.0708 10.5429 12.9802 10.367 12.9455 10.1765C12.9108 9.98593 12.9335 9.78937 13.0108 9.61178C13.088 9.43419 13.2163 9.28358 13.3794 9.1791C13.5425 9.07461 13.7329 9.02097 13.9265 9.02499C14.1828 9.03212 14.4261 9.13899 14.6047 9.32285C14.7833 9.50671 14.8831 9.75304 14.8828 10.0094Z"
                                                fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1251_68">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </template>
                            </Button>
                            <Button v-if="useAppStatesStore().enableChatbot" type="button" label="Chatbot AI"
                                icon="pi pi-envelope" @click="chatbot" severity="success" class="mr-2" :pt="{
        root: {
            class: 'border-none',
            style: {
                background: '#45A4F4',
                'height': '40px',
            }
        }
    }">
                                <template #icon>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" class="mr-2"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_1251_67)">
                                            <path
                                                d="M17.0368 7.15888H17.3454C18.8315 7.15888 20.3178 7.15888 21.8044 7.15888C22.7868 7.16083 23.4378 7.80666 23.4378 8.79624C23.4404 11.6061 23.4404 14.416 23.4378 17.2259C23.4378 18.2259 22.792 18.864 21.7874 18.8653C21.3428 18.8653 20.8981 18.8653 20.4242 18.8653V19.1459C20.4242 20.0794 20.4242 21.0126 20.4242 21.9453C20.4242 22.2826 20.2972 22.4929 20.0439 22.5886C19.7803 22.6882 19.54 22.6048 19.3206 22.3353C18.4244 21.2324 17.529 20.1289 16.6344 19.0248C16.5956 18.97 16.5433 18.9261 16.4827 18.8971C16.4221 18.8682 16.3551 18.8552 16.2881 18.8594C14.0706 18.8646 11.8532 18.8657 9.63574 18.8626C8.58691 18.8626 7.95736 18.2305 7.95605 17.1784C7.95605 16.4236 7.95605 15.6689 7.95605 14.9141L7.87793 14.8509C7.85835 14.9097 7.83168 14.9659 7.7985 15.0183C7.1084 15.8702 6.41699 16.7209 5.72428 17.5703C5.68327 17.6211 5.64421 17.6732 5.59928 17.7201C5.42025 17.9056 5.20866 17.9766 4.95866 17.8867C4.72038 17.8008 4.5778 17.5996 4.5765 17.3216C4.57324 16.3718 4.5765 15.4212 4.5765 14.4714V14.1673H4.20606C3.85645 14.1673 3.50749 14.1719 3.15788 14.1673C2.2041 14.1511 1.56283 13.4987 1.56152 12.5397C1.56152 10.6231 1.56152 8.70662 1.56152 6.79039C1.56152 5.87893 1.56152 4.97072 1.56152 4.06122C1.56152 3.11786 2.2015 2.4577 3.14746 2.45575C7.24902 2.44924 11.3506 2.44924 15.4521 2.45575C16.3896 2.45575 17.0225 3.09833 17.0342 4.03843C17.0459 4.97854 17.0342 5.90627 17.0342 6.83791L17.0368 7.15888ZM5.74772 15.6042L5.7985 15.6224C6.40788 14.8737 7.02506 14.1315 7.62142 13.3724C7.83756 13.0964 8.08366 12.9863 8.43327 12.9877C10.7484 12.9987 13.0628 12.9942 15.3779 12.9929C15.7581 12.9929 15.863 12.8919 15.863 12.5202C15.863 9.70944 15.863 6.89933 15.863 4.08986C15.863 3.72723 15.7614 3.62502 15.3949 3.62502C11.3337 3.62502 7.27224 3.62502 3.21061 3.62502C2.83822 3.62502 2.73275 3.7357 2.73275 4.10614C2.73275 6.90822 2.73275 9.71009 2.73275 12.5117C2.73275 12.8815 2.84147 12.9916 3.21126 12.9929C3.81283 12.9929 4.41374 12.9929 5.01465 12.9929C5.5459 12.9929 5.74707 13.1986 5.74772 13.7331C5.74859 14.3572 5.74859 14.9809 5.74772 15.6042ZM19.2061 20.3314L19.2555 20.3138C19.2555 19.6628 19.2555 19.0176 19.2555 18.3698C19.2555 17.9219 19.4827 17.6953 19.9287 17.6934C20.5459 17.6934 21.1657 17.6934 21.7803 17.6934C22.1637 17.6934 22.2686 17.5879 22.2686 17.1992C22.2686 14.4063 22.2686 11.6131 22.2686 8.81968C22.2686 8.43687 22.1605 8.33205 21.7731 8.33205C20.2788 8.33205 18.7846 8.33205 17.2907 8.33205H17.0381V8.65757C17.0381 9.92385 17.0381 11.1908 17.0381 12.4571C17.043 12.6435 17.0257 12.83 16.9867 13.0124C16.805 13.7357 16.2015 14.1693 15.3857 14.1706C13.4048 14.1706 11.4233 14.1706 9.44108 14.1706H9.13184V14.4401C9.13184 15.3516 9.13184 16.2609 9.13184 17.168C9.13184 17.6048 9.22298 17.6953 9.66048 17.696C11.9339 17.696 14.208 17.7051 16.4814 17.6875C16.8981 17.6875 17.1807 17.8138 17.4333 18.1433C18.0042 18.8822 18.611 19.6035 19.2061 20.3314Z"
                                                fill="white" />
                                            <path
                                                d="M9.11426 9.45835H7.12142V10.5C7.12142 11.013 6.91504 11.2813 6.52767 11.2748C6.15137 11.2676 5.9502 10.9994 5.9502 10.5033C5.9502 9.04972 5.9502 7.59572 5.9502 6.1413C5.9502 5.60354 6.15007 5.40106 6.68066 5.40106C7.65506 5.40106 8.62988 5.40106 9.60514 5.40106C10.0719 5.40106 10.2855 5.61786 10.2861 6.08921C10.2861 7.59182 10.2861 9.09464 10.2861 10.5977C10.2861 11.0189 10.055 11.2904 9.7002 11.291C9.34538 11.2917 9.11426 11.0189 9.11426 10.599C9.11426 10.2285 9.11426 9.85419 9.11426 9.45835ZM7.13118 8.26499H9.09668V6.58596H7.13249L7.13118 8.26499Z"
                                                fill="white" />
                                            <path
                                                d="M13.0703 8.3327C13.0703 9.08726 13.0703 9.84116 13.0703 10.5957C13.0703 11.0195 12.8411 11.2793 12.4805 11.2741C12.1198 11.2689 11.901 11.0137 11.9004 10.6042C11.9004 9.08725 11.9004 7.57055 11.9004 6.05405C11.9004 5.7064 12.0879 5.45965 12.3743 5.40822C12.5109 5.37939 12.6534 5.40171 12.7746 5.47096C12.8958 5.54021 12.9874 5.65156 13.0319 5.78387C13.06 5.88489 13.0725 5.98961 13.069 6.09442C13.0716 6.84311 13.0703 7.5866 13.0703 8.3327Z"
                                                fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1251_67">
                                                <rect width="25" height="25" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </template>
                            </Button>
                            <Button type="button" v-if="useAppStatesStore().enableNoti" label="" text icon="pi pi-bell"
                                @click="notification" severity="warning"
                                :badge="useNotificationHubStore().notifications != null ? useNotificationHubStore().notifications.unRead : 0"
                                badgeClass="p-badge-danger" class="mr-2" aria-controls="overlay_notification" />
                            <OverlayPanel id="overlay_notification" ref="op" appendTo="body">
                                <DataTable :value="useNotificationHubStore().notifications.items" :rows="5" :pt="{
        paginator: {
            root: {
                class: 'border-none'
            }
        }
    }">
                                    <Column field="message" header="Nội dung"></Column>
                                    <Column field="time" header="Thời gian"></Column>
                                    <Column class="flex justify-content-end">
                                        <template #header>
                                            <Button label="Đọc hết" text raised @click="ReadAllNoti()" />
                                        </template>
                                        <template #body="slotProps">
                                            <div class="flex align-items-center">
                                                <Button icon="pi pi-check" text rounded
                                                    @click="ReadNoti(slotProps.data.id)" />
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>
                                <Paginator @page="ChangeNotiPage"
                                    :rows="useNotificationHubStore().notifications.pageSize"
                                    :totalRecords="useNotificationHubStore().notifications.total"
                                    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" />
                            </OverlayPanel>
                            <Button severity="primary" text class="flex px-2 py-0 mr-2" @click="account"
                                aria-haspopup="true" aria-controls="overlay_menu">
                                <template #icon>
                                    <img v-if="useAppStatesStore().user.id != null" width="35" height="35"
                                        src="./assets/img/test.png" class="block m-auto mr-1 border-circle border-2"
                                        style="object-fit: cover;">
                                    <img v-else width="35" height="35" src="./assets/img/logo.png"
                                        class="block m-auto mr-1 border-circle border-2" style="object-fit: cover;">
                                </template>
                            </Button>
                            <Menu ref="menu" id="overlay_menu" :model="useAppStatesStore().menuUsers" :popup="true">
                                <template #item="{ item }">
                                    <a v-ripple @click="menuAction(item.code)" v-if="item.visible"
                                        class="block py-3 px-3 cursor-pointer">
                                        <span :class="item.icon" />
                                        <span class="ml-2">{{ item.label }}</span>
                                    </a>
                                </template>
                            </Menu>
                            <Button icon="pi pi-check" v-if="useAppStatesStore().enableCheckCanhBao" aria-label="Filter"
                                @click="Check" class="mr-2" />
                        </div>
                    </template>
                </Menubar>
                <ScrollPanel style="height: calc(100vh - 72px);" class="w-full">
                    <RouterView />
                </ScrollPanel>
            </div>

        </div>

    </div>
    <Sidebar v-model:visible="sidebarVisible" :pt="{
        content: {
            class: 'px-0 py-0 overflow-hidden'
        },
        header: {
            class: 'absolute right-0'
        }
    }" class="w-12rem">
        <div class="w-full border-noround px-0"
            :style="'background-color:#1f40af;background-image: url(' + BASE_SRC + '/assets/img/background.png' + ')'">
            <div class="justify-content-center py-3">
                <img src="./assets/img/logo.png" class="block m-auto">
            </div>
            <ScrollPanel style="width: 100%; height: calc(100vh - 117px); background-color: transparent;">
                <TieredMenu :model="useAppStatesStore().sidebars" class=" border-none w-full px-0"
                    style="background-color: transparent;">
                    <template #item="{ item }">
                        <router-link :to="item.router">
                            <div class="px-1 py-3 justify-content-center border-none border-bottom-1"
                                @click="sidebarVisible = false" :class="item.active ? 'active' : ''"
                                style="border-color:rgba(255, 255, 255, 0.2);">
                                <img :src="item.icon" class="block m-auto">
                                <span class="block text-center text-white font-normal px-3">{{ item.label }}</span>
                            </div>
                        </router-link>
                    </template>
                </TieredMenu>
            </ScrollPanel>
        </div>
    </Sidebar>
    <ProgressSpinner v-if="useAppStatesStore().showLoading" style="width: 100px; height: 100px" strokeWidth="4"
        fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" :pt="{
        root: {
            style: {
                'position': 'fixed',
                'top': 'calc(50vh - 50px)',
                'left': 'calc(50vw - 50px)',
                'z-index': '1000'
            },
        }
    }" />
</template>
<style>
.p-progress-spinner{
    z-index: 10000 !important;
}
.menu-bg {
    background: var(--menu-bg) !important;
}

.menu-button {
    background-color: var(--menu-button-color) !important;
}

.menu-text-color {
    color: var(--text-color) !important;
}

.menu-text-color-active {
    color: var(--menu-text-color) !important;
}

.p-calendar .p-button {
    border-radius: 0 6px 6px 0 !important;
}

.p-calendar .p-inputtext {
    border-radius: 6px 0 0 6px !important;
}

.p-datatable .p-datatable-thead>tr>th {
    color: var(--title-color) !important;
    background: var(--table-header-color) !important;
}

.p-datatable .p-datatable-tbody>tr>td {
    color: var(--text-color) !important;
}

.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover,
.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content {
    background: rgba(255, 255, 255, 0.2) !important;
    cursor: pointer;
}

.p-tieredmenu .active {
    background: rgba(255, 255, 255, 0.2) !important;
}

a {
    text-decoration: none;
}

/* 
.p-datatable.p-datatable-striped .p-datatable-tbody>tr:nth-child(even) {
    background: #eff3f8;
} */
</style>