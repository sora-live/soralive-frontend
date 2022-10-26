<template>
    <div v-if="require_password">
        <div class="password-center">
            <h1>{{t('info.needEntryPassword')}}</h1>
            <div class="password-enterarea">
                <form @submit.prevent="getPlayInfo">
                    <div class="row mb-3">
                        <div class="form-group">
                            <div class="offset-sm-3 col-sm-5">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="inputpass" :placeholder="t('info.password')" v-model="password">
                                    <button type="submit" class="btn btn-success btn-lg">{{t("info.open")}}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="modal fade" tabindex="-1" role="dialog" id="confirmDialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">{{t('info.operationConfirmation')}}</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ confirmDialogInfo }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="confirmOk">{{t('info.confirm')}}</button>
                        <button type="button" class="btn btn-default" data-bs-dismiss="modal">{{t('info.cancel')}}</button>
                    </div>
                </div>
            </div>
        </div>
        <h1>{{ roomname }}</h1>
        <p>@{{ uname }}</p>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-9">
                    <div v-if="is_streaming" class="player-slot">
                        <Player :url="streaming_uri" :type="player_type"></Player>
                    </div>
                    <div id="playerSlot" class="player-slot" v-else>
                        <div v-if="is_loading" class="player-area">{{t("info.loading")}}</div>
                        <div v-else class="player-area">{{t("info.noStreaming")}}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="row justify-content-between">
                        <h4 class="col-6">{{t("info.realTimeComments")}}</h4>
                        <div class="col-4 comment-eye-right"><span class="material-icons" :title="t('info.onlineCount')">remove_red_eye</span><span class="online-person">{{online}}</span></div>
                    </div>
                    <div class="comment-area" id="commentarea">
                        <div class="comment-line" v-for="comment in commentList" :key="comment.cmtId" :class="{'bg-info': comment.author.uid === 0}">
                            <span class="comment-user">{{comment.author.uname}}：</span>
                            <span v-if="comment.isDeleted" class="comment-deleted">[{{t('info.deletedMessage')}}]</span>
                            <span v-else>{{comment.comment.content}}</span>
                            <ul class="comment-op" v-if="isAdmin">
                                <li><a href="javascript:;" @click="retractComment(comment.cmtId)">{{t("info.delete")}}</a></li>
                                <li><a href="javascript:;" @click="userban(comment.author)">{{t("info.userban")}}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="comment-input-area">
                        <form autocomplete="off" @submit.prevent="sendComment">
                            <div class="row mb-3">
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="comment-input" v-model="input_comment" :disabled="!is_readyForChat">
                                        <button type="submit" class="btn btn-primary" :disabled="!is_readyForChat">{{t("info.send")}}</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h3>{{t("info.description")}}</h3>
            <div>{{ description }}</div>
        </div>
        <div v-if="isAdmin">
            <h3>{{t("info.onlineuserlist")}}</h3>
            <p><a href="javascript:;" @click="getOnline">{{t("info.refresh")}}</a></p>
            <div v-for="u in onlineList" :key="u.uid" class="online-list">
                <span>{{ u.uname }}</span>
                <span class="online-b"><a href="javascript:;" @click="userban(u)">{{t("info.userban")}}</a></span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(../assets/MaterialIcons-Regular.woff2) format('woff2'),
    url(../assets/MaterialIcons-Regular.woff) format('woff'),
    url(../assets/MaterialIcons-Regular.ttf) format('truetype');
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
}
.online-person{
    font-size: 18px;
    padding-left: 15px;
}
.player-slot{
    background-color: black;
    height: 480px;
    @media screen and (min-width: 1200px) and (max-width: 1800px) {
        height: 600px;
    }
    @media screen and (min-width: 1800px) {
        height: 720px;
    }
}
.player-area{
    color: white;
    font-size: 40px;
    text-align: center;
    padding-top: 20%;
}
.password-center{
    text-align: center;
}
.password-enterarea{
    margin-top: 300px;
}
.password-area-submit{
    margin-top: 100px;
}
.comment-area{
    height: 397px;
    @media screen and (min-width: 1200px) and (max-width: 1800px) {
        height: 517px;
    }
    @media screen and (min-width: 1800px) {
        height: 637px;
    }
    overflow-y: scroll;
}
.comment-header{
    height: 10px;
}
.comment-input-area{
    margin-top: 10px;
}
.comment-line{
    margin: 5px;
}
.comment-user{
    color: rgb(111, 159, 173);
    font-weight: bold;
    cursor: pointer;
}
.comment-line:hover>.comment-op{
    display: inline;
}
.comment-op{
    display: none;
}
.comment-op li{
    display: inline;
    padding-left: 5px;
}
.comment-deleted{
    font-style: italic;
}
.online-b{
    padding-left: 200px;
}
.online-list{
    margin: 25px;
}
.comment-eye-right{
    text-align: right;
}
</style>

<script setup>
import { nextTick, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import gConst from '../globalconst'
import fetchpost, { fetchPostWithSign } from '../util/fetchpost';
import sleep from '../util/sleep'
import { Modal } from 'bootstrap'
import Player from './player.vue'

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

let chatroom_ws;
let confirmDialogCallback;

const roomid = ref(0);
const roomname = ref("Room Title");
const uname = ref("username");
const description = ref("Description");
const is_loading = ref(true);
const is_streaming = ref(false);
const streaming_uri = ref("");
const require_password = ref(false);
const password = ref("");
const online = ref(0);
const input_comment = ref("");
const is_readyForChat = ref(false);
const commentList = ref([]);
const confirmDialogInfo = ref("");
const onlineList = ref([]);
const player_type = ref(0);

const isAdmin = computed(() => {
    let type = parseInt(localStorage.getItem('user-type') || "0");
    return (type >> 4 & 1) == 1;
});

onMounted(() => {
    getPlayInfo();
    connectChatRoom();
});

onBeforeUnmount(() => {
    if (chatroom_ws !== undefined && chatroom_ws !== null) {
        console.log("close ws.");
        chatroom_ws.close();
    }
});

async function getPlayInfo() {
    roomid.value = route.params.uid;
    let api = gConst.apiRoot + "index/roominfo";
    let res;
    if (localStorage.getItem('token') == null) {
        res = await fetchpost(api, {
            uid: roomid.value
        });
    } else if (password.value == "") {
        res = await fetchPostWithSign(api, {
            uid: roomid.value,
            token: localStorage.getItem('token') || ""
        });
    } else {
        res = await fetchPostWithSign(api, {
            uid: roomid.value,
            token: localStorage.getItem('token') || "",
            password: password.value
        });
    }
    
    let resjson = await res.json();

    if (resjson['error'] == 16) {
        require_password.value = true;
        return;
    }

    if (resjson['error'] == 17) {
        gConst.globalbus.emit("send-info", "tips.wrongPassword");
        return;
    }

    if (resjson['error'] != 0) {
        gConst.globalbus.emit("send-info", resjson['info']);
        router.push('/list');
        return;
    }

    roomname.value = resjson.roomname;
    uname.value = resjson.uname;
    description.value = resjson.description;
    is_loading.value = false;
    require_password.value = false;
    player_type.value = resjson.player_type;

    if (resjson.streaming == 1) {
        is_streaming.value = true;
        streaming_uri.value = resjson.streaming_uri;
    }
}
async function connectChatRoom() {
    let ws_api = gConst.wsHost;
    chatroom_ws = new WebSocket(ws_api);
    chatroom_ws.addEventListener('open', () => {
        wsSend({
            token: localStorage.getItem('token') || "",
            roomid: roomid.value,
            cmd: 1
        });
        wsStartHeartbeat();
    });

    chatroom_ws.addEventListener('message', e => {
        let msg = JSON.parse(e.data);
        switch (msg.cmd) {
            case 1:
                {
                    if(msg.error == 0){
                        is_readyForChat.value = true;
                    }
                    online.value = msg.online;
                }
                break
            case 2:
                {
                    online.value = msg.online;
                }
                break;
            case 3:
                {
                    commentList.value.splice(0, commentList.value.length - 999);
                    commentList.value.push(msg);
                    gConst.globalbus.emit("recv-comment", msg);
                    //自动滚动到底部
                    nextTick(() => {
                        let commentarea = document.getElementById('commentarea');
                        commentarea.scrollTop = commentarea.scrollHeight + 50;
                    });
                }
                break;
            case 4:
                {
                    switch(msg.subCmd) {
                        case 3:
                            {
                                router.push('/');
                                localStorage.removeItem('token');
                                localStorage.removeItem('uname');
                                localStorage.removeItem('sk');
                                localStorage.removeItem('uid');
                                localStorage.removeItem('user-type');
                                gConst.globalbus.emit("send-info", "tips.youHaveBanned");
                                gConst.status.isLogin = localStorage.getItem("token") == null;
                            }
                            break;
                        case 4:
                            {
                                for(let i in commentList.value){
                                    let cmt = commentList.value[i];
                                    if(cmt.cmtId == msg.extraInfo){
                                        cmt.isDeleted = true;
                                        commentList.value.splice(i, 1, cmt);
                                        break;
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    });
}
async function wsStartHeartbeat() {
    while (chatroom_ws !== undefined && chatroom_ws !== null && chatroom_ws.readyState == 1) {
        wsSend({
            cmd: 2
        });
        await sleep(30000);
    }
}
async function wsSend(msg) {
    if (chatroom_ws !== undefined && chatroom_ws !== null && chatroom_ws.readyState == 1) {
        chatroom_ws.send(JSON.stringify(msg));
    } else {
        console.log("ws connection has already closed or not been established.");
    }
}
async function sendComment() {
    if (input_comment.value !== "") {
        wsSend({
            cmd: 3,
            comment: {
                content: input_comment.value
            }
        })
        input_comment.value = "";
    }
}
async function retractComment(cmtId) {
    if (isAdmin.value) {
        let api = gConst.apiRoot + "chatadmin/retractcomment";
        await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || "",
            roomId: roomid.value,
            cmtId: cmtId
        });
    }
}
async function userban(user) {
    confirmDialogInfo.value = t('tips.banConfirm', { uname: user.uname });
    confirmDialogCallback = async function(){
        let api = gConst.apiRoot + "chatadmin/userban";
        await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || "",
            roomId: roomid.value,
            uid: user.uid
        });
    }

    let modal = new Modal(document.getElementById("confirmDialog"));
    modal.show();
}
async function confirmOk(){
    if (confirmDialogCallback){
        confirmDialogCallback();
    }
    let modal = new Modal(document.getElementById("confirmDialog"));
    modal.hide();
}
async function getOnline(){
    if(isAdmin.value){
        let api = gConst.apiRoot + "chatadmin/online";
        let res = await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || "",
            roomId: roomid.value,
        });

        let resjson = await res.json();
        if (resjson["error"] != 0) {
            gConst.globalbus.emit("send-info", resjson['info']);
        }

        onlineList.value = resjson["online"];
    }
}
</script>