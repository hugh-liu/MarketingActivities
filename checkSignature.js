const crypto = require('crypto');
module.exports = (opts) => {
    const {
        signature,
        timestamp,
        nonce,
    } = opts;

    const MY_TOKEN = 'hugh1014';// Token

    const array = new Array(MY_TOKEN, timestamp, nonce);

    const MY_SIGNATURE = crypto.createHash('sha1')
        .update(array.sort().toString().replace(/,/g, ""), 'utf-8')
        .digest('hex');
    return MY_SIGNATURE === signature;
}