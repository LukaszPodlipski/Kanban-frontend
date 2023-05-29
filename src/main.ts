import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import PrimeVue from 'primevue/config'
import router from './router/index'

import BaseButton from './components/base/BaseButton.vue'

import './style.css'
import 'primevue/resources/themes/saga-blue/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core CSS
import 'primeicons/primeicons.css' //icons
import '/node_modules/primeflex/primeflex.css'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue)
app.use(router)
app.use(pinia)

app.component('BaseButton', BaseButton)

app.mount('#app')
