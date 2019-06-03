const { createDecipheriv, createCipheriv, randomBytes } = require("crypto");

const [SLASH, COLON] = [47, 58];

class Util {

    constructor() {
        throw new Error("This class cannot be initialized with new");
    }

    static parsePart(val) {
        const type = Number(val.charCodeAt(0) === COLON);
        if (type) val = val.substring(1);
        return { val, type };
    }

    static split(url) {
        if (url.length === 1 && url.charCodeAt(0) === SLASH) return [url];
        else if (url.charCodeAt(0) === SLASH) url = url.substring(1);
        return url.split("/");
    }

    static parse(url) {
        return Util.split(url).map(Util.parsePart);
    }

    static encrypt(data, secret) {
        const iv = randomBytes(16);
        const cipher = createCipheriv("aes-256-cbc", secret, iv);
        return `${cipher.update(JSON.stringify(data), "utf8", "base64") + cipher.final("base64")}.${iv.toString("base64")}`;
    }

    static decrypt(token, secret) {
        const [data, iv] = token.split(".");
        const decipher = createDecipheriv("aes-256-cbc", secret, Buffer.from(iv, "base64"));
        return JSON.parse(decipher.update(data, "base64", "utf8") + decipher.final("utf8"));
    }

}

module.exports = Util;
