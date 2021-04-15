<template>
    <div class="login-area">
        <div class="alert alert-danger" role="alert" v-if="isAlert">
            <span>{{t(alertInfo)}}</span>
        </div>
        <form @submit.prevent="dochangepass">
            <div class="row mb-3">
                <label for="oldPassword" class="col-sm-2 col-form-label">{{t("info.oldPassword")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="oldPassword" :placeholder="t('info.oldPassword')" v-model="oldpass">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword" class="col-sm-2 col-form-label">{{t("info.newPassword")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" :placeholder="t('info.newPassword')" v-model="password">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword2" class="col-sm-2 col-form-label">{{t("info.repass")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword2" :placeholder="t('info.repass')" v-model="repass">
                </div>
            </div>
            <div class="row mb-3">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit" class="btn btn-primary">{{t("info.updatePassword")}}</button>
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
import { fetchPostWithSign } from '../util/fetchpost'

const { t } = useI18n();
const router = useRouter();

const oldpass = ref("");
const password = ref("");
const repass = ref("");
const isAlert = ref(false);
const alertInfo = ref("info.null");


async function dochangepass() {
    if (password.value != repass.value){
        alertInfo.value = "tips.repassDifferent";
        isAlert.value = true;
    } else {
        let api = gConst.apiRoot + "user/changepass";
        let res = await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || "",
            oldpass: oldpass.value,
            pass: password.value,
        });
        let data = await res.json();
        if (data['error'] == 1) {
            isAlert.value = true;
            alertInfo.value = data['info'];
        } else {
            gConst.globalbus.emit("send-info", "tips.changePassSuccess");
            localStorage.removeItem('token');
            localStorage.removeItem('uname');
            localStorage.removeItem('sk');
            localStorage.removeItem('uid');
            localStorage.removeItem('user-type');
            router.push('/login');
            gConst.status.isLogin = localStorage.getItem("token") == null;
        }
    }
    
}
</script>