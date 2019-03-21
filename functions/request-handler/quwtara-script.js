const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const app = express();
const storage = admin.storage();
const config = functions.config().scripts || {
  bucket: {
    name: storage.app.options.storageBucket,
  },
};

app.get('', (req, res) => {
  res.sendStatus(404);
});

/**
 * 指定された名前のscriptファイルを返す。
 */
app.get('/:name', (req, res) => {
  const scriptName = req.params.name;
  const bucket = storage.bucket(config.bucket.name);
  const file = bucket.file(`scripts/${scriptName}/index.js`);
  const errHandle = (err) => {
    console.error('エラーが発生', err);
    res.sendStatus(500);
  };
  file.exists()
      .then((exists) => {
        if (!exists[0]) {
          res.sendStatus(404);
          throw new Error(`「${scriptName}」なんてないよ`);
        }
        return file.download();
      }, errHandle)
      .then((buf) => {
        res.set('Cache-Control', `public, max-age=${12*60}, s-maxage=${24*60}`);
        res.set('Content-Type', 'application/javascript; charset=utf-8');
        res.status(200).send(buf.toString('utf-8', 0, buf.length));
      }, errHandle);
});

module.exports = functions.https.onRequest(app);
