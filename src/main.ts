import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'

import PrimeVue from 'primevue/config'
import router from './router/index'

import Tooltip from 'primevue/tooltip'

import BaseButton from './components/base/BaseButton.vue'
import BaseInput from './components/base/BaseInput.vue'
import BasePasswordInput from './components/base/BasePasswordInput.vue'
import BaseSearch from './components/base/BaseSearch.vue'

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
app.directive('tooltip', Tooltip)

app.config.globalProperties.$http = axios

app.component('BaseButton', BaseButton)
app.component('BaseInput', BaseInput)
app.component('BasePasswordInput', BasePasswordInput)
app.component('BaseSearch', BaseSearch)

app.mount('#app')
