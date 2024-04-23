import { createApp } from 'vue/dist/vue.esm-bundler'
import { createPinia } from 'pinia'
import { useNotificationHubStore } from '@/stores/notificationhub'
import { useStateHubStore } from '@/stores/statehub'
import { useAppStatesStore } from '@/stores/appstates'
import { useChatHubStore } from '@/stores/chathub'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice';
/* import font awesome icon component */
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast';

import Dialog from "primevue/dialog"
import Button from "primevue/button"
import InputText from 'primevue/inputtext';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';


import FileUpload from 'primevue/fileupload';
import PickList from 'primevue/picklist';
import App from './App.vue'
import router from './router'
import Tooltip from 'primevue/tooltip';
// theme
import 'primeflex/primeflex.css';
import './assets/fixchartjs.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// import as directive
import BadgeDirective from 'primevue/badgedirective';

const app = createApp(App)
app.use(PrimeVue, { ripple: true });
app.use(router)
app.use(ConfirmationService);
app.use(ToastService);
app.component("Toast", Toast);
app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('FileUpload', FileUpload);
app.component('PickList', PickList);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('InputText', InputText);
app.directive('badge', BadgeDirective);
app.directive('tooltip', Tooltip);
app.use(createPinia())
app.use(useNotificationHubStore().start())
app.use(useStateHubStore().start())
app.use(useAppStatesStore().start())
app.use(useChatHubStore().start())

app.mount('#app')



