<template>
    <div class="policy">
        <h1>{{t("privacy.title")}}</h1>
        <p>{{t("privacy.intro")}}</p>
        <h2>{{t("privacy.collectTitle")}}</h2>
        <p>{{t("privacy.collectContent")}}</p>
        <h2>{{t("privacy.useTitle")}}</h2>
        <p>{{t("privacy.useContent")}}</p>
        <h2>{{t("privacy.storageTitle")}}</h2>
        <p>{{t("privacy.storageContent")}}</p>
        <h2>{{t("privacy.rightsTitle")}}</h2>
        <p>{{t("privacy.rightsContent")}}</p>
        <h2>{{t("privacy.contactTitle")}}</h2>
        <p>{{t("privacy.contactContent")}}</p>
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
