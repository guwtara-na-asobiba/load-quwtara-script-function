const admin = require('firebase-admin');
admin.initializeApp();

exports.hello = require('./request-handler/hello');
