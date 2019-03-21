const functions = require('firebase-functions');
const admin = require('firebase-admin');
const storage = admin.storage();
const config = functions.config().scripts || {
  bucket: {
    name: storage.app.options.storageBucket,
  },
};

/**
 * 指定された名前のscriptファイルを返す。
 */
module.exports = functions.https.onRequest((req, res) => {
  const scriptName = req.query.name;
  if (!scriptName) {
    res.sendStatus(400);
    return;
  }
  const version = req.query.v || 'latest';
  const path = `scripts/${scriptName}/${scriptName}-${version}.min.js`;
  const bucket = storage.bucket(config.bucket.name);
  const file = bucket.file(path);
  const errHandle = (err) => {
    console.error('エラーが発生', err);
    res.sendStatus(err.httpStatus || 500);
  };
  file.exists()
      .then((exists) => {
        if (!exists[0]) {
          const err = new Error(`「${path}」なんてないよ`);
          err.httpStatus = 404;
          throw err;
        }
        return file.download();
      }, errHandle)
      .then((buf) => {
        res.set('Cache-Control',
            `public, max-age=${12*60*60}, s-maxage=${24*60*60}`);
        res.set('Content-Type',
            'application/javascript; charset=utf-8');
        res.status(200).send(buf.toString('utf-8', 0, buf.length));
      }, errHandle);
});
