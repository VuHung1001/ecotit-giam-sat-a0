import { createRouter, createWebHistory } from 'vue-router'
import env from '@/env.js';
const router = createRouter({
    history: createWebHistory(env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/Dashboard.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('../views/ChatView.vue')
        },
        {
            path: '/accessdenied',
            name: 'accessdenied',
            component: () => import('../views/AccessDenied.vue')
        },
        {
            path: '/a0',
            name: 'a0',
            component: () => import('../views/A0-api.vue')
        },
    ]
})

export default router
