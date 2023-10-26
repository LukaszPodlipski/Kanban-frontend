import i18n from '@/locale'
import axios from 'axios'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'

import App from './App.vue'
import BaseButton from './components/base/BaseButton.vue'
import BaseButtonTabs from './components/base/BaseButtonTabs.vue'
import BaseDialogTextarea from './components/base/BaseDialogTextarea.vue'
import BaseDoubleClickInput from './components/base/BaseDoubleClickInput.vue'
import BaseDoubleClickSelect from './components/base/BaseDoubleClickSelect.vue'
import BaseInput from './components/base/BaseInput.vue'
import BasePasswordInput from './components/base/BasePasswordInput.vue'
import BaseSearch from './components/base/BaseSearch.vue'
import BaseSelect from './components/base/BaseSelect.vue'
import router from './router/index'

import './assets/styles/index.scss' //global styles
import '@/assets/styles/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core primevue UI framework styles
import 'primeicons/primeicons.css' //icons
import '/node_modules/primeflex/primeflex.css'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue)
app.use(router)
app.use(pinia)
app.use(ToastService)
app.use(i18n)

app.directive('tooltip', Tooltip)

app.config.globalProperties.$http = axios

app.component('BaseButton', BaseButton)
app.component('BaseInput', BaseInput)
app.component('BasePasswordInput', BasePasswordInput)
app.component('BaseSearch', BaseSearch)
app.component('BaseSelect', BaseSelect)
app.component('BaseDoubleClickSelect', BaseDoubleClickSelect)
app.component('BaseDoubleClickInput', BaseDoubleClickInput)
app.component('BaseButtonTabs', BaseButtonTabs)
app.component('BaseDialogTextarea', BaseDialogTextarea)

app.mount('#app')
