<template>
    <div class="jumbotron">
        <div class="jumbotron-centerhead" v-html="t('promotion.home')"></div>
        <p>&nbsp;</p>
        <p>{{t("tips.homeDescription")}}</p>
        <p><router-link to="/reg" class="btn btn-primary btn-lg" role="button">{{t("info.joinnow")}}</router-link></p>
    </div>
</template>

<style lang="scss" scoped>
.jumbotron{
    background-color: rgb(238, 238, 238);
    border-radius: 6px;
    padding: 60px;
    font-size: 2rem;
}
.jumbotron-centerhead{
    text-align: center;
    font-size: 67px;
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
</script>