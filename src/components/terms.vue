<template>
    <div class="policy">
        <h1>{{t("terms.title")}}</h1>
        <p>{{t("terms.intro")}}</p>
        <h2>{{t("terms.accountTitle")}}</h2>
        <p>{{t("terms.accountContent")}}</p>
        <h2>{{t("terms.contentTitle")}}</h2>
        <p>{{t("terms.contentContent")}}</p>
        <h2>{{t("terms.changeTitle")}}</h2>
        <p>{{t("terms.changeContent")}}</p>
        <h2>{{t("terms.liabilityTitle")}}</h2>
        <p>{{t("terms.liabilityContent")}}</p>
        <h2>{{t("terms.contactTitle")}}</h2>
        <p>{{t("terms.contactContent")}}</p>
    </div>
</template>

<style lang="scss" scoped>
.policy {
    max-width: 960px;
    margin: 30px auto;
    line-height: 1.8;
}
.policy h1,
.policy h2 {
    margin-top: 20px;
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
</script>
