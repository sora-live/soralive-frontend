import { JSEncrypt } from 'jsencrypt'

export function encryptPassword(publicKey, password) {
    let jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    let encryptedPassword = jsEncrypt.encrypt(password);

    return encryptedPassword;
}