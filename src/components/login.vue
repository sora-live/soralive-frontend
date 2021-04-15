<template>
    <div class="login-area">
        <div class="alert alert-danger" role="alert" v-if="isAlert">
            <span>{{t(alertInfo)}}</span>
        </div>
        <form @submit.prevent="dologin">
            <div class="row mb-3">
                <label for="inputUname" class="col-sm-2 col-form-label">{{t("info.uname")}}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputUname" :placeholder="t('info.uname')" v-model="uname">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword" class="col-sm-2 col-form-label">{{t("info.password")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" :placeholder="t('info.password')" v-model="password">
                </div>
            </div>
            <div class="row mb-3">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit" class="btn btn-primary">{{t("info.login")}}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style lang="scss">
.login-area{
    min-width: 300px;
    max-width: 600px;
    width: 50%;
    margin: auto;
    padding-top: 50px;
}
</style>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import gConst from '../globalconst'
import fetchpost from '../util/fetchpost'
import { encryptPassword } from '../util/crypt'


const { t } = useI18n();
const router = useRouter();

const isAlert = ref(false);
const alertInfo = ref("info.null");
const uname = ref("");
const password = ref("");

if (localStorage.getItem("token") != null) {
    gConst.globalbus.emit("send-info", "tips.alreadyLogin");
    router.push('/');
}

async function dologin(){
    let res = await fetchpost(gConst.apiRoot + 'user/prelogin', {});
    let json = await res.json();
    
    let publicKey = json['key'];
    let token = json['token'];

    let encryptedPassword = encryptPassword(publicKey, password.value);
    if (!encryptedPassword) {
        isAlert.value = true;
        alertInfo.value = "tips.loginencryptfailed";
        return;
    }
    
    let res2 = await fetchpost(gConst.apiRoot + "user/login", {
        token,
        uname: uname.value,
        pass: encryptedPassword
    });
    let loginRes = await res2.json();

    if (loginRes['error'] != 0) {
        isAlert.value = true;
        alertInfo.value = loginRes['info'];
        return;
    }

    localStorage.setItem('token', loginRes['token']);
    localStorage.setItem('sk', loginRes['user']['sk']);
    localStorage.setItem('uname', loginRes['user']['uname']);
    localStorage.setItem('uid', loginRes['user']['uid']);
    localStorage.setItem('user-type', loginRes['user']['type']);
    
    gConst.globalbus.emit("send-info", "tips.loginSucceed");
    router.push('/');
    gConst.status.isLogin = localStorage.getItem("token") == null;
}
</script>