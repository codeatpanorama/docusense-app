import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'vue3-lottie/dist/style.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VDataTable } from 'vuetify/labs/VDataTable'
import Vue3Lottie from 'vue3-lottie'
import VueCookies from 'vue3-cookies'
import VueWordCloud from 'vue3-word-cloud';

const vuetify = createVuetify({
  components: {
    ...components,
    VDataTable,
  },
  defaults: {
    VDataTable: {
      fixedHeader: true,
      noDataText: 'Results not found',
    },
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'light'
  }
})

const app = createApp(App)

app.use(vuetify)

app.use(router)

app.use(Vue3Lottie)

app.use(VueCookies)

app.component(VueWordCloud.name, VueWordCloud);

app.mount('#app')
