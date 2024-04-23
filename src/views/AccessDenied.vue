<script setup>

import { onMounted } from 'vue'
import { useAppStatesStore } from '@/stores/appstates'
onMounted(async () => {
    useAppStatesStore().navbars = [{
        icon: 'pi pi-fw pi-file',
        label: 'Access Denied',
        route: '/accessdenied',
        visible: true
    }]
})
</script>
<template>
    AccessDenied
</template>
