<template>
    <div class="player-wrapper">
        <div id="dplayer"></div>
    </div>
</template>

<style lang="scss">
.player-wrapper{
    background-color: black;
    height: 100%;
    width: 100%;
    position: relative;
}
#dplayer{
    width: 100%;
    height: 100%;
}
.dplayer-comment{
    display: none !important;
}
</style>

<script setup>
import { computed, defineProps, nextTick, onMounted, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import gConst from '../globalconst'
import DPlayer from 'dplayer'
import Hls from 'hls.js'
import flvjs from 'flv.js'
import mpegts from 'mpegts.js'

const { locale } = useI18n();

const props = defineProps({
    url: String,
    type: Number
});

const { url, type } = toRefs(props);

const dPlayerLang = computed(() => {
    if (locale.value == "en") return "en";
    else return "zh-cn";
});

localStorage.setItem("dplayer-danmaku-opacity", "1.0");

onMounted(() => {
    let videoConfig = {};
    if (type.value === 0) {
        videoConfig = {
            url: url.value,
            type: 'customHls',
            customType: {
                customHls: function (video, player) {
                    const hls = new Hls();
                    hls.loadSource(video.src);
                    hls.attachMedia(video);
                    player.events.on("destroy", () => {
                        hls.destroy();
                    });
                }
            }
        }
    } else if (type.value === 1) {
        videoConfig = {
            url: url.value,
            type: 'customFlv',
            customType: {
                customFlv: function (video, player) {
                    const flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: video.src
                    });
                    flvPlayer.attachMediaElement(video);
                    flvPlayer.load();
                    player.events.on("destroy", () => {
                        flvPlayer.destroy();
                    });
                }
            }
        }
    } else if (type.value === 2){
        videoConfig = {
            url: url.value,
            type: 'customMpegts',
            customType: {
                customMpegts: function (video, player) {
                    const mpegtsPlayer = new mpegts.createPlayer({
                        type: 'mse',
                        isLive: true,
                        url: video.src
                    });
                    mpegtsPlayer.attachMediaElement(video);
                    mpegtsPlayer.load();
                    player.events.on("destroy", () => {
                        mpegtsPlayer.destroy();
                    });
                }
            }
        }
    }

    const dp = new DPlayer({
        container: document.getElementById("dplayer"),
        live: true,
        autoplay: true,
        lang: dPlayerLang.value,
        video: videoConfig,
        danmaku: {
            id: "LIVE",
            api: "SORALIVE"
        },
        apiBackend: {
            read: function (opt) {
                let { url, success, error } = opt;
                success([]);
            },
            send: function (opt) {
                let { url, data, success, error } = opt;
                error();
            }
        }
    });

    gConst.globalbus.on("recv-comment", msg => {
        let comment = {
            text: msg.comment.content,
            color: "#FFFFFF",
            type: "right"
        };
        dp.danmaku.draw(comment);
    });

    nextTick(() => {
        let menu = dp.container.querySelector('.dplayer-menu');
        let us = dp.container.querySelectorAll('.dplayer-menu-item')[1];

        menu.removeChild(us);
    });
})


</script>