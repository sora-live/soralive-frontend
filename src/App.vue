<template>
    <div id="app">
        <Modal></Modal>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">{{ t("info.soralive") }}</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" :aria-label="t('action.toggleNavbar')">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mg-lg-0">
                        <li class="nav-item"><router-link class="nav-link" to="/">{{ t("info.home") }}</router-link></li>
                        <li class="nav-item"><router-link class="nav-link" to="/list">{{t("info.allLive")}}</router-link></li>
                    </ul>
                    <ul class="navbar-nav d-flex">
                        <li class="nav-item dropdown">
                            <a href="javascript:;" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                                {{t("lang." + locale)}} <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="javascript:;" @click="chlang('zh')">{{t("lang.zh")}}</a></li>
                                <li><a class="dropdown-item" href="javascript:;" @click="chlang('en')">{{t("lang.en")}}</a></li>
                            </ul>
                        </li>
                        <template v-if="isLogin">
                        <li class="nav-item"><router-link class="nav-link" to="/reg">{{t("info.reg")}}</router-link></li>
                        <li class="nav-item"><router-link class="nav-link" to="/login">{{t("info.login")}}</router-link></li>
                        </template>
                        <template v-else>
                        <li class="nav-item dropdown">
                            <a href="javascript:;" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                                {{ uname }} <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><router-link class="dropdown-item" to="/user">{{t("info.userCenter")}}</router-link></li>
                                <li><a class="dropdown-item" href="javascript:;" @click="jumptomyroom">{{t("info.myLiveRoom")}}</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="javascript:;" @click="logout">{{t("info.logout")}}</a></li>
                            </ul>
                        </li>
                        </template>
                    </ul>
                </div>

            </div>
        </nav>
        <div class="container-fluid main-content">
            <router-view></router-view>
        </div>
        <footer class="footer">
            <div class="container-fluid footer-content">
                <div>©SoraLive 2018-2021.</div>
                <div>Special Thanks to MeowSound Idols and other supporters.</div>
            </div>
        </footer>
    </div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/dist/css/bootstrap.css";
body{
    padding-top: 70px;
}
.main-content{
    min-height: 100vh;
}
.footer {
    width: 100%;
    height: 60px;
    background-color: #ebebeb;
}
.footer-content {
    padding-top: 10px;
    color: #666;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

console.log("SoraLive 0.1.0 created by MoewSound Idols.");
locale.value = localStorage.getItem("lang") || "zh";

const isLogin = computed(() => localStorage.getItem("token") == null);
const uname = computed(() => localStorage.getItem("uname") || "[][NULL]");

function chlang(v) {
    locale.value = v;
    localStorage.setItem("lang", v);
}
function logout(){

}
</script>
