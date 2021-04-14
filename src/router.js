import { createRouter, createWebHistory } from 'vue-router'

import HelloWorld from './components/HelloWorld.vue'

const routes = [
    {path: '/', name: "home", component: HelloWorld},
    // {path: '/list', name: "list", component: ListPage},
    // {path: '/login', name: "login", component: LoginPage},
    // {path: '/reg', name: "reg", component: RegPage},
    // {path: '/user', name: "user", component: UserPage},
    // {path: '/changepass', name: "changepass", component: ChangePassPage},
    // {path: '/live/:uid', name: "live", component: LivePage},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;