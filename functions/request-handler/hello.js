const functions = require('firebase-functions');

/**
 * こんにちはを返す。
 */
module.exports = functions.https.onRequest((req, res) => {
  res.send('こんにちーわ！！！');
});
