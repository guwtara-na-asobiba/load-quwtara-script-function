const admin = require('firebase-admin');
admin.initializeApp();

exports.hello = require('./request-handler/hello');
exports.scripts = require('./request-handler/quwtara-script');
