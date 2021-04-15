import { reactive } from 'vue'
import mitt from 'mitt'

const gConst = {
    apiRoot: "https://api.minyami.net/apiv2/",
    wsHost: "wss://api.minyami.net",
    globalbus: mitt(),
    status: reactive({
        isLogin: false
    })
}

export default gConst;