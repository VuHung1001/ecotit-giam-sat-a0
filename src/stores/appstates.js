import { defineStore } from 'pinia'
import Api from '@/commons/basehttp';
import { useNotificationHubStore } from '@/stores/notificationhub'
import { useStateHubStore } from '@/stores/statehub'
import moment from 'moment-timezone'
import router from "@/router";
import env from '@/env.js';
const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
moment.locale(locale);

export const useAppStatesStore = defineStore('appstates', {
    state: () => ({
        user: {
            username: localStorage.getItem("authen.username"),
            displayName: localStorage.getItem("authen.displayName"),
            donVi: localStorage.getItem("authen.donVi"),
        },
        enableChatbox: false,
        enableChatbot: false,
        enableNoti: false,
        showCanhBaoBanChaoMoi: false,
        sidebars: [],
        navbars: [],
        menuUsers: [
            {
                label: localStorage.getItem("authen.displayName") != '' ? localStorage.getItem("authen.displayName") : 'Đăng nhập',
                icon: 'pi pi-fw pi-user',
                code: 'PROFILE',
                visible: true,
            },
            {
                label: 'Dark mode',
                icon: 'pi pi-fw pi-moon',
                code: 'THEME',
                visible: true,
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-fw pi-sign-out',
                code: 'LOGOUT',
                visible: localStorage.getItem("authen.username") != '',
            }
        ],
        sidebarState: localStorage.getItem("sidebar_state"),
        themeMode: localStorage.getItem("theme-mode"),
        ptHeaderrow: {
            style: 'height: 40px'
        },
        ptableContent: 'py-1 px-1',
        ptPaginator: {
            class: 'flex',
            root: {
                class: 'border-noround border-none border-bottom-1 surface-border border-right-1 border-left-1 flex-1 h-3rem border-top-1'
            },
            current: {
                class: 'flex align-items-center justify-content-start flex-1 h-2rem mb-5'
            },
            firstpagebutton: {
                class: 'h-2rem mb-5'
            },
            previouspagebutton: {
                class: 'h-2rem mb-5'
            },
            pagebutton: {
                class: 'h-2rem mb-5',
                style: 'min-width: 2rem'
            },
            nextpagebutton: {
                class: 'h-2rem mb-5'
            },
            lastpagebutton: {
                class: 'h-2rem mb-5'
            },
            pagedropdown: {
                class: 'h-2rem mb-5'
            },
            rowperpagedropdown: {
                root: {
                    class: 'h-2rem mb-5'
                },
                input: {
                    style: 'padding: 0.3rem 0.5rem',

                }
            }
        },
        view: {
            w: 10,
            h: 600,
        },
        showLoading: false,
        refreshingToken: false
    }),
    actions: {
        updateMenu() {
            let self = this;
            //update nav
            //update sidebar
            let binder = setInterval(async () => {
                //load function 
                if (useStateHubStore().functions != null) {
                    self.sidebars = [];
                    self.enableChatbot = false;
                    self.enableChatbox = false;
                    self.enableCheckCanhBao = false;
                    self.enableNoti = false;
                    if (useStateHubStore().functions.giamSatBanChao != null && useStateHubStore().functions.giamSatBanChao.functions.length > 0) {
                        let giamSatBanChao = {
                            label: useStateHubStore().functions.giamSatBanChao.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatBanChao.icon,
                            router: useStateHubStore().functions.giamSatBanChao.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatBanChao.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatBanChao.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatBanChao)
                    }
                    if (useStateHubStore().functions.giamSatCongBoCongSuat != null && useStateHubStore().functions.giamSatCongBoCongSuat.functions.length > 0) {
                        let giamSatCongBoCongSuat = {
                            label: useStateHubStore().functions.giamSatCongBoCongSuat.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatCongBoCongSuat.icon,
                            router: useStateHubStore().functions.giamSatCongBoCongSuat.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatCongBoCongSuat.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatCongBoCongSuat.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatCongBoCongSuat)
                    }
                    if (useStateHubStore().functions.danhGiaPhuTai != null && useStateHubStore().functions.danhGiaPhuTai.functions.length > 0) {
                        let danhGiaPhuTai = {
                            label: useStateHubStore().functions.danhGiaPhuTai.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.danhGiaPhuTai.icon,
                            router: useStateHubStore().functions.danhGiaPhuTai.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.danhGiaPhuTai.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            danhGiaPhuTai.navbars.push(nav)
                        });
                        self.sidebars.push(danhGiaPhuTai)
                    }
                    if (useStateHubStore().functions.danhGiaHuyDongNguon != null && useStateHubStore().functions.danhGiaHuyDongNguon.functions.length > 0) {
                        let danhGiaHuyDongNguon = {
                            label: useStateHubStore().functions.danhGiaHuyDongNguon.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.danhGiaHuyDongNguon.icon,
                            router: useStateHubStore().functions.danhGiaHuyDongNguon.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.danhGiaHuyDongNguon.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            danhGiaHuyDongNguon.navbars.push(nav)
                        });
                        self.sidebars.push(danhGiaHuyDongNguon)
                    }

                    if (useStateHubStore().functions.giamSatKhaDungNguon != null && useStateHubStore().functions.giamSatKhaDungNguon.functions.length > 0) {
                        let giamSatKhaDungNguon = {
                            label: useStateHubStore().functions.giamSatKhaDungNguon.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatKhaDungNguon.icon,
                            router: useStateHubStore().functions.giamSatKhaDungNguon.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatKhaDungNguon.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatKhaDungNguon.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatKhaDungNguon)
                    }
                    if (useStateHubStore().functions.giamSatVanHanh != null && useStateHubStore().functions.giamSatVanHanh.functions.length > 0) {
                        let giamSatVanHanh = {
                            label: useStateHubStore().functions.giamSatVanHanh.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatVanHanh.icon,
                            router: useStateHubStore().functions.giamSatVanHanh.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatVanHanh.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatVanHanh.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatVanHanh)
                    }
                    if (useStateHubStore().functions.giamSatNangLuongTaiTao != null && useStateHubStore().functions.giamSatNangLuongTaiTao.functions.length > 0) {
                        let giamSatNangLuongTaiTao = {
                            label: useStateHubStore().functions.giamSatNangLuongTaiTao.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatNangLuongTaiTao.icon,
                            router: useStateHubStore().functions.giamSatNangLuongTaiTao.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatNangLuongTaiTao.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatNangLuongTaiTao.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatNangLuongTaiTao)
                    }
                    if (useStateHubStore().functions.giamSatThuyVan != null && useStateHubStore().functions.giamSatThuyVan.functions.length > 0) {
                        let giamSatThuyVan = {
                            label: useStateHubStore().functions.giamSatThuyVan.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatThuyVan.icon,
                            router: useStateHubStore().functions.giamSatThuyVan.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatThuyVan.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatThuyVan.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatThuyVan)
                    }
                    if (useStateHubStore().functions.giamSatNhienLieu != null && useStateHubStore().functions.giamSatNhienLieu.functions.length > 0) {
                        let giamSatNhienLieu = {
                            label: useStateHubStore().functions.giamSatNhienLieu.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatNhienLieu.icon,
                            router: useStateHubStore().functions.giamSatNhienLieu.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatNhienLieu.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatNhienLieu.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatNhienLieu)
                    }
                    if (useStateHubStore().functions.giamSatDongDienCTMoi != null && useStateHubStore().functions.giamSatDongDienCTMoi.functions.length > 0) {
                        let giamSatDongDienCTMoi = {
                            label: useStateHubStore().functions.giamSatDongDienCTMoi.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.giamSatDongDienCTMoi.icon,
                            router: useStateHubStore().functions.giamSatDongDienCTMoi.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.giamSatDongDienCTMoi.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            giamSatDongDienCTMoi.navbars.push(nav)
                        });
                        self.sidebars.push(giamSatDongDienCTMoi)
                    }
                    if (useStateHubStore().functions.baoCao != null && useStateHubStore().functions.baoCao.functions.length > 0) {
                        let baoCao = {
                            label: useStateHubStore().functions.baoCao.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.baoCao.icon,
                            router: useStateHubStore().functions.baoCao.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.baoCao.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            baoCao.navbars.push(nav)
                        });
                        self.sidebars.push(baoCao)
                    }
                    if (useStateHubStore().functions.quanTriHeThong != null && useStateHubStore().functions.quanTriHeThong.functions.length > 0) {
                        let quanTriHeThong = {
                            label: useStateHubStore().functions.quanTriHeThong.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.quanTriHeThong.icon,
                            router: useStateHubStore().functions.quanTriHeThong.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.quanTriHeThong.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            quanTriHeThong.navbars.push(nav)
                        });
                        self.sidebars.push(quanTriHeThong)
                    }
                    if (useStateHubStore().functions.danhMuc != null && useStateHubStore().functions.danhMuc.functions.length > 0) {
                        let danhMuc = {
                            label: useStateHubStore().functions.danhMuc.name,
                            icon: env.VITE_BASE_SRC + useStateHubStore().functions.danhMuc.icon,
                            router: useStateHubStore().functions.danhMuc.router,
                            active: false,
                            visible: true,
                            navbars: []
                        }
                        useStateHubStore().functions.danhMuc.functions.forEach(item => {
                            let nav = {
                                label: (item.shortName != '' ? item.shortName : item.name),
                                route: item.router,
                                icon: item.icon,
                                visible: true,
                            };
                            danhMuc.navbars.push(nav)
                        });
                        self.sidebars.push(danhMuc)
                    }
                    if (useStateHubStore().functions.heThong != null && useStateHubStore().functions.heThong.functions.length > 0) {

                        let chat = useStateHubStore().functions.heThong.functions.find(f => f.code == "CHAT");
                        let bot = useStateHubStore().functions.heThong.functions.find(f => f.code == "BOT");
                        let checkCanhbao = useStateHubStore().functions.heThong.functions.find(f => f.code == "CHECK");
                        let noti = useStateHubStore().functions.heThong.functions.find(f => f.code == "NOTI");
                        self.enableChatbox = chat != null && chat.actions.length > 0;
                        self.enableChatbot = bot != null && bot.actions.length > 0;
                        self.enableCheckCanhBao = checkCanhbao != null && checkCanhbao.actions.length > 0;
                        self.enableNoti = noti != null && noti.actions.length > 0;
                        if (self.enableNoti && !useNotificationHubStore().hasRegiterNoti) {
                            useNotificationHubStore().connection.on("Notifications", (notis) => {
                                useNotificationHubStore().notifications = notis;
                                if (useNotificationHubStore().lastUnread != notis.unRead) {
                                    let binder = setInterval(async () => {
                                        if (useNotificationHubStore().audio.readyState === 4 && document.readyState === "complete") {
                                            try { useNotificationHubStore().audio.play(); } catch { useNotificationHubStore().audio.play(); }
                                            clearInterval(binder);
                                        }
                                    }, 100)
                                    useNotificationHubStore().lastUnread = notis.unRead;
                                }
                            });
                            useNotificationHubStore().connection.on("HasNotification", (obj) => {
                                if (obj.type === 'BANCHAOMOI') {
                                    self.showCanhBaoBanChaoMoi = true;
                                    self.loadDanhSachBanChao();
                                }
                            });
                            useNotificationHubStore().hasRegiterNoti = true;
                            await useNotificationHubStore().connection.invoke("HubConnected", localStorage.getItem('authen.username'));
                        }
                    }
                    clearInterval(binder);
                }
            }, 100);
        },
        logout() {
            let self = this;
            Api.get("/token/revoke/" + useNotificationHubStore().connection.connection.connectionId)
                .then(response => {
                    if (response.status == 204) {
                        setTimeout(function () {
                            localStorage.setItem('authen.token.value', '')
                            localStorage.setItem('authen.token.refresh', '')
                            router.push({ name: 'dashboard' });
                            self.updateMenu()
                        }, 1000)
                    }
                })
                .catch(e => {
                    self.updateMenu()
                    useNotificationHubStore().toast({
                        type: 'error',
                        message: e.message
                    })
                })
        },
        start() {
            let self = this;
            self.updateMenu()
            setInterval(function () {
                let token = localStorage.getItem("authen.token.value");
                if (localStorage.getItem("login.rememberme.value") == "T" || navigator.userActivation.isActive) {
                    if (self.isTokenExpiredSoon(token) && !self.refreshingToken) {
                        self.refreshingToken = true;
                        const form = new FormData();
                        form.append('accessToken', localStorage.getItem("authen.token.value"));
                        form.append('refreshToken', localStorage.getItem("authen.token.refresh"));
                        Api.post("/token/refresh", form)
                            .then(response => {
                                //console.log(response)
                                if (response.status == 200) {
                                    localStorage.setItem('authen.token.value', response.data.token)
                                    localStorage.setItem('authen.token.refresh', response.data.refreshToken)
                                    self.refreshingToken = false;
                                    setTimeout(function () {
                                        self.updateMenu()
                                    }, 300)
                                }
                                else {
                                    localStorage.setItem('authen.token.value', '')
                                    localStorage.setItem('authen.token.refresh', '')
                                    self.refreshingToken = false;
                                    setTimeout(function () {
                                        self.updateMenu()
                                    }, 300)
                                }
                            })
                            .catch(e => {
                                console.log(e)
                                localStorage.setItem('authen.token.value', '')
                                localStorage.setItem('authen.token.refresh', '')
                                self.refreshingToken = false;
                                setTimeout(function () {
                                    self.updateMenu()
                                }, 300)
                            })
                    }
                }
                if (token == null || token == '' || self.isTokenExpired(token)) {
                    router.push({ name: 'login' })
                }
            }, 100);
        },
        isTokenExpired(token) {
            if (!token) return false;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayload = JSON.parse(atob(base64));

            // Check the 'exp' (expiration) claim in the decoded payload
            const expirationTimestamp = decodedPayload.exp * 1000; // Convert to milliseconds
            const currentTimestamp = new Date().getTime();

            return currentTimestamp > expirationTimestamp;
        },
        isTokenExpiredSoon(token) {
            if (!token) return false;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayload = JSON.parse(atob(base64));

            // Check the 'exp' (expiration) claim in the decoded payload
            const expirationTimestamp = decodedPayload.exp * 1000; // Convert to milliseconds
            const currentDate = new Date();
            const newDate = new Date(currentDate);
            newDate.setTime(currentDate.getTime() + (60 * 1000));
            const currentTimestamp = newDate;
            return currentTimestamp > expirationTimestamp;
        },
        loadDanhSachBanChao() {

        },
        convertViToEn(str, toUpperCase = false) {
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
            str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        
            return toUpperCase ? str.toUpperCase() : str;
        }
    }
})

