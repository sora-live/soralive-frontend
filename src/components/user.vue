<template>
    <div class="container-fluid">
        <div class="row">
        <div class="col-sm-8">
            <section v-if="isOpen">
                <div>
                    <h3>{{t("info.liveroomInfo")}}</h3>
                    <p>
                        {{t("info.status")}}:
                        <button class="btn" :class="{'btn-default': streaming, 'btn-success': !streaming}" @click="setStreamClose">{{t("info.close")}}</button>
                        <button class="btn" :class="{'btn-default': !streaming, 'btn-success': streaming}" @click="setStreamOpen">{{t("info.open")}}</button>
                    </p>
                    <p>
                        {{t("info.roomname")}}:
                        <input class="textbox" type="text" v-model="roomname" size="70">
                    </p>
                    <p>
                        {{t("info.description")}}:
                        <textarea class="textarea" v-model="description" cols="70" rows="6"></textarea>
                    </p>
                    <p>
                        <button class="btn btn-primary" @click="updateRN">{{t("info.updateRN")}}</button>
                    </p>
                    <p>
                        {{t("info.privatelevel")}}:
                        <button class="btn" :class="{'btn-default': privateLevel != 0, 'btn-success': privateLevel == 0}" @click="setPrivate(0)">{{t("info.anyone")}}</button>
                        <button class="btn" :class="{'btn-default': privateLevel != 1, 'btn-success': privateLevel == 1}" @click="setPrivate(1)">{{t("info.needloged")}}</button>
                        <button class="btn" :class="{'btn-default': privateLevel != 2, 'btn-success': privateLevel == 2}" @click="setPrivate(2)">{{t("info.needpassword")}}</button>
                    </p>
                    <p>
                        {{t("info.privatepassword")}}:
                        <input class="textbox" type="text" v-model="privatePassword" size="50">
                        <button class="btn btn-primary" @click="setPrivate(undefined)">{{t("info.updatePassword")}}</button>
                    </p>
                </div>
                <div>
                    <h3>{{t("info.streamParam")}}</h3>
                    <p>
                        {{t("info.selectStreamPushType")}}: 
                        <button class="btn" :class="{'btn-default': streamType.pushType != 0, 'btn-success': streamType.pushType == 0}" @click="streamType.pushType = 0">{{t("info.localServer")}}</button>
                        <button class="btn" :class="{'btn-default': streamType.pushType != 1, 'btn-success': streamType.pushType == 1}" @click="streamType.pushType = 1">{{t("info.custom")}}</button>
                    </p>
                    <p v-if="streamType.pushType === 0">
                        {{t("info.selectStreamServer")}}:
                        <select class="form-select" v-model="streamType.serverId">
                            <option v-for="s in serverList" :value="s.id">{{s.name}}</option>
                        </select>
                    </p>
                    <p v-if="streamType.pushType === 1">
                        {{t("info.customStreamUrl")}}:
                        <input class="form-control" type="text" v-model="streamType.playUrl">
                    </p>
                    <p>
                        {{t("info.playerType")}}: 
                        <button class="btn" :class="{'btn-default': streamType.playType != 0, 'btn-success': streamType.playType == 0}" @click="streamType.playType = 0">HLS</button>
                        <button class="btn" :class="{'btn-default': streamType.playType != 1, 'btn-success': streamType.playType == 1}" @click="streamType.playType = 1">FLV</button>
                        <button class="btn" :class="{'btn-default': streamType.playType != 2, 'btn-success': streamType.playType == 2}" @click="streamType.playType = 2">HTTP-TS</button>
                    </p>
                    <p>
                        <button class="btn btn-primary" @click="updateStreamType">{{t("info.updateStreamType")}}</button>
                    </p>
                    <div class="alert alert-danger" role="alert" v-if="isSetStreamType === false">
                        <p>
                            {{t("tips.setStreamTypeFirst")}}
                        </p>
                    </div>
                    <hr>
                    <p>{{t("info.streamServer")}}: {{serverList.find(x => x.id === streamType.serverId)?.rtmp}} <button class="btn btn-info btn-sm" @click="copyStreamingURL">{{t("action.copy")}}</button></p>
                    <p>{{t("info.streamKey")}}: {{streamkey || t("tips.clickButtonBelowToResetStreamKey")}} <button class="btn btn-info btn-sm" @click="copyStreamKey">{{t("action.copy")}}</button></p>
                    <p>SRT (beta): {{srtUrl || t("tips.clickButtonBelowToResetStreamKey")}} <button class="btn btn-info btn-sm" @click="copySrtUrl">{{t("action.copy")}}</button></p>
                    <p>
                        <button class="btn btn-info" @click="resetSK">{{t("info.resetStreamKey")}}</button>
                        <br>
                        <span style="color: #666">{{t("tips.resetStreamKeyTips1")}}</span>
                        <br>
                        <span style="color: #666">{{t("tips.resetStreamKeyTips2")}}</span>
                    </p>
                </div>
            </section>
            <section v-else>
                <div v-html="t(loadingInfo)"></div>
            </section>
        </div>
        <div class="col-sm-4">
            <h3>{{t("info.basicInfo")}}</h3>
            <p>UID: {{uid}}</p>
            <p>{{t("info.email")}}: {{email}}</p>
            <p>{{t("info.uname")}}: {{uname}}</p>
            <p><router-link to="/changepass">{{t("info.changepass")}}</router-link></p>
        </div>
        </div>
    </div>
</template>

<style lang="scss">
.textbase {
    color: black;
    border-radius: 4px;
    border: 1px solid rgb(202, 202, 202);
    padding: 10px;
    font-size: 14px;
}

.textbox {
    @extend .textbase;
    height: 34px;
}

.textarea {
    @extend .textbase;
}
</style>


<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import gConst from '../globalconst'
import { fetchPostWithSign } from '../util/fetchpost'
import copyTextToClipboard from '../util/copytext'

const { t } = useI18n();
const router = useRouter();

const cover = ref("");
const description = ref("");
const email = ref("");
const roomname = ref("");
const streaming = ref(false);
const streamkey = ref("");
const type = ref(0);
const uid = ref(0);
const uname = ref("");
const loadingInfo = ref("info.loading");
const privateLevel = ref(0);
const privatePassword = ref("");
const channelName = ref("");
const streamingId = ref("");

const serverList = ref([]);
const isSetStreamType = ref(false);
const streamType = ref({
    pushType: 0,
    serverId: "",
    playType: 0,
    playUrl: ""
});

const isOpen = computed(() => (type.value & 1) == 1);
const isAdmin = computed(() => (type.value >> 4 & 1) == 1);

const srtUrl = computed(() => {
    let server = serverList.value.find(x => x.id === streamType.value.serverId);
    if (!server) return null;
    return server.srt + "?streamid=#!::r=live/" + channelName.value + ",m=publish,streamingid=" + streamingId.value
});

refresh();

async function refresh() {
    let api = gConst.apiRoot + "user/detail";
    let res = await fetchPostWithSign(api, {
        token: localStorage.getItem('token') || ""
    });
    let json = await res.json();
    if (json['error'] != 0) {
        gConst.globalbus.emit("send-info", json['info']);
        return;
    } else {
        localStorage.setItem('user-type', json['user']['type']);
        localStorage.setItem('uid', json['user']['uid']);
        localStorage.setItem('uname', json['user']['uname']);
        uid.value = json['user']['uid'];
        uname.value = json['user']['uname'];
        type.value = json['user']['type'];
        streamkey.value = json['user']['streamkey'];
        roomname.value = json['user']['roomname'];
        email.value = json['user']['email'];
        description.value = json['user']['description'];
        cover.value = json['user']['cover'];
        streaming.value = json['user']['streaming'] == "1";
        privateLevel.value = json['user']['privateLevel'];
        privatePassword.value = json['user']['privatePassword'];
        loadingInfo.value = "tips.needApprove";
        channelName.value = json['user']['channel'];
        streamingId.value = json['user']['streamingid'];

        serverList.value = json['server_list'];
        if (json['stream_type'] != null) {
            isSetStreamType.value = true;
            streamType.value = json['stream_type'];
        }
        else{
            isSetStreamType.value = false;
        }
    }
}

async function setStreamOpen() {
    if (!streaming.value) {
        let api = gConst.apiRoot + "user/changestatus";
        let res = await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || "",
            status: 1
        });
        let json = await res.json();
        if (json['error'] == 0) {
            streaming.value = true;
        } else {
            gConst.globalbus.emit("send-info", json['info'])
        }
    } else {
        console.log("[BAKA INFO] Streaming is already OPEN.");
    }
}
async function setStreamClose() {
    if (streaming.value) {
        let api = gConst.apiRoot + "user/changestatus";
        let res = await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || "",
            status: 0
        });
        let json = await res.json();
        if (json['error'] == 0) {
            streaming.value = false;
        } else {
            gConst.globalbus.emit("send-info", json['info'])
        }
    } else {
        console.log("[BAKA INFO] Streaming is already CLOSE.");
    }
}
async function updateRN() {
    let rn = roomname.value || "";
    let desc = description.value || "";

    let api = gConst.apiRoot + "user/updatern";
    let res = await fetchPostWithSign(api, {
        token: localStorage.getItem('token') || "",
        roomname: rn,
        description: desc
    });
    let json = await res.json();
    if (json['error'] == 0) {
        gConst.globalbus.emit("send-info", "tips.updateRnSucceed");
    } else {
        gConst.globalbus.emit("send-info", json['info'])
    }
}

async function updateStreamType() {
    let api = gConst.apiRoot + "user/updatestreamkey";
    let res = await fetchPostWithSign(api, {
        token: localStorage.getItem('token') || "",
        ...streamType.value
    });
    let json = await res.json();
    if (json['error'] == 0) {
        gConst.globalbus.emit("send-info", "tips.updateStreamTypeSucceed");
    } else {
        gConst.globalbus.emit("send-info", json['info'])
    }
}

async function resetSK() {
    let api = gConst.apiRoot + "user/resetkey";
    let res = await fetchPostWithSign(api, {
        token: localStorage.getItem('token') || ""
    });
    let json = await res.json();
    if (json['error'] != 0) {
        gConst.globalbus.emit("send-info", json['info']);
        return;
    } else {
        location.reload();
    }
}
async function setPrivate(level) {
    let currentLevel = privateLevel.value;
    if(level !== undefined) currentLevel = level;
    let api = gConst.apiRoot + "user/updateprivatelevel";

    let res = await fetchPostWithSign(api, {
        token: localStorage.getItem('token') || "",
        privateLevel: currentLevel,
        privatePassword: privatePassword.value
    });
    let json = await res.json();
    if (json['error'] != 0) {
        gConst.globalbus.emit("send-info", json['info']);
        return;
    } else {
        if (level == undefined) {
            gConst.globalbus.emit("send-info", json['info']);
        } else {
            privateLevel.value = level;
        }
    }
}
function copyStreamingURL() {
    copyTextToClipboard(streaming_address.value);
}
function copyStreamKey() {
    copyTextToClipboard(streamkey.value);
}
function copySrtUrl() {
    copyTextToClipboard(srtUrl.value);
}
</script>