import hmacSha1 from 'crypto-js/hmac-sha1'
import encBase64 from 'crypto-js/enc-base64'

function hmac_sha1(text, pass) {
    let encrypted = hmacSha1(text, pass);

    let res = encBase64.stringify(encrypted);
    return res;
}

export default function fetchpost(url, data){
    let dataBody = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: dataBody
    });
}

export function fetchPostWithSign(url, data) {
    data['ts'] = Date.now();
    let unsignedString = Object.keys(data).sort().reduce((unsigned, i) => unsigned += i + data[i], "");
    let sk = localStorage.getItem("sk");
    let sign = hmac_sha1(unsignedString, sk);
    data['sign'] = sign;

    let dataBody = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: dataBody
    });
}