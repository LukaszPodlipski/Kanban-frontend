import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config';

import './style.css'
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons
import '/node_modules/primeflex/primeflex.css';

const app = createApp(App)

app.use(PrimeVue)

app.mount('#app')
