import { reactive } from 'vue'
import mitt from 'mitt'

const gConst = {
    apiRoot: import.meta.env.VITE_API_ROOT,
    wsHost: import.meta.env.VITE_WS_HOST,
    globalbus: mitt(),
    status: reactive({
        isLogin: false
    })
}

export default gConst;