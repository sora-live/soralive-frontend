import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import router from './router'

import App from './App.vue'
import 'bootstrap'

import en from './locales/en'
import zh from './locales/zh'

const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    fallbackLocale: 'en',
    messages: {
        zh,
        en
    }
});


const app = createApp(App);

app.use(i18n);
app.use(router);
app.mount('#app');
