import axios from 'axios';
import { useAppStatesStore } from '@/stores/appstates'
import router from "@/router";
import env from "@/env.js";
const Api = axios.create({
    withCredentials: true,
    baseURL: env.VITE_SERVER_URL + '/api/',
    headers: {
        "Content-Type": "application/json; charset=utf8"
    },
    "validateStatus": function (status) {
        if (status == 401) {
            useAppStatesStore().user.username = null;
            useAppStatesStore().user.displayName = 'Đăng nhập';
            localStorage.setItem('authen.token.value', '')
            localStorage.setItem('authen.token.refresh', '')
        }
        else if (status == 403) {
            setTimeout(function () {
                router.push({ name: 'accessdenied' })
            }, 1000);
        }
        return status >= 200 && status < 300;
    }
});
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authen.token.value');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
Api.interceptors.response.use(function (response) {
    return response;
}, function (error) {

    return Promise.reject(error);
});
export default Api;