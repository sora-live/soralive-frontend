<template>
    <div class="login-area">
        <div class="alert alert-danger" role="alert" v-if="isAlert">
            <span>{{t(alertInfo)}}</span>
        </div>
        <form @submit.prevent="doreg">
            <div class="row mb-3">
                <label for="inputUname" class="col-sm-2 col-form-label">{{t("info.uname")}}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputUname" :placeholder="t('info.uname')" v-model="uname">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputEmail" class="col-sm-2 col-form-label">{{t("info.email")}}</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="inputEmail" :placeholder="t('info.email')" v-model="email">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword" class="col-sm-2 col-form-label">{{t("info.password")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" :placeholder="t('info.password')" v-model="password">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword2" class="col-sm-2 col-form-label">{{t("info.repass")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword2" :placeholder="t('info.repass')" v-model="repass">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputRoomname" class="col-sm-2 col-form-label">{{t("info.roomname")}}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputRoomname" :placeholder="t('info.roomname')" v-model="roomname">
                </div>
            </div>
            <div class="row mb-3">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit" class="btn btn-primary">{{t("info.reg")}}</button>
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
import fetchPost from '../util/fetchpost'

const { t } = useI18n();
const router = useRouter();

const uname = ref("");
const email = ref("");
const password = ref("");
const repass = ref("");
const roomname = ref("");
const isAlert = ref(false);
const alertInfo = ref("info.null");

if (localStorage.getItem("token") != null) {
    gConst.globalbus.emit("send-info", "tips.alreadyLogin");
    router.push('/');
}

async function doreg() {
    if (password.value != repass.value) {
        alertInfo.value = "tips.repassDifferent";
        isAlert.value = true;
    } else {
        let api = gConst.apiRoot + "user/reg";
        let res = await fetchPost(api, {
            uname: uname.value,
            email: email.value,
            pass: password.value,
            roomname: roomname.value
        });
        let data = await res.json();
        if (data['error'] == 1) {
            isAlert.value = true;
            alertInfo.value = data['info'];
        } else {
            gConst.globalbus.emit("send-info", "tips.registerSuccess");
            router.push('/login');
        }
    }
}
</script>