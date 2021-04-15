<template>
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">{{t(title)}}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{t(msg)}}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-bs-dismiss="modal">{{t("action.close")}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.modal{
    color: black;
}
</style>


<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Modal } from 'bootstrap'
import gConst from '../globalconst'

const { t } = useI18n();

const title = ref("info.info");
const msg = ref("info.null");

function showModal() {
    let modal = new Modal(document.getElementById("myModal"));
    modal.show();
}

gConst.globalbus.on("send-info", (info) => {
    msg.value = info;
    showModal();
});
</script>
