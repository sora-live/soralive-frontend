import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './components/home.vue'
import ListPage from './components/list.vue'
import LoginPage from './components/login.vue'
import RegPage from './components/reg.vue'
import PrivacyPage from './components/privacy.vue'
import TermsPage from './components/terms.vue'
import UserPage from './components/user.vue'
import ChangePassPage from './components/changepass.vue'
import LivePage from './components/live.vue'

const routes = [
    {path: '/', name: "home", component: HomePage},
    {path: '/list', name: "list", component: ListPage},
    {path: '/login', name: "login", component: LoginPage},
    {path: '/reg', name: "reg", component: RegPage},
    {path: '/privacy', name: "privacy", component: PrivacyPage},
    {path: '/terms', name: "terms", component: TermsPage},
    {path: '/user', name: "user", component: UserPage},
    {path: '/changepass', name: "changepass", component: ChangePassPage},
    {path: '/live/:uid', name: "live", component: LivePage},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
