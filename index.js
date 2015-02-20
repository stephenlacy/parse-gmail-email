var addressparser = require('addressparser');

module.exports = function(data, cb) {

  if (!data) {
    return cb(new Error('email required'));
  }

  if (!data.payload) {
    return cb(new Error('email payload required'));
  }

  if (!data.payload.headers) {
    return cb(new Error('email headers required'));
  }

  var email = {};

  var headers = data.payload.headers;
  for (i = 0; i < headers.length; i++) {
    var header = headers[i];

    if (header.name && header.name === 'To') {
      email.to = header.value;
    }
    if (header.name && header.name === 'From') {
      email.from = header.value;
    }
    if (header.name && header.name === 'Subject') {
      email.subject = header.value;
    }
    if (header.name && header.name === 'Cc') {
      email.cc = header.value;
    }
  }

  email.id = data.id;
  email.threadId = data.threadId;
  email.snippet = data.snippet;
  var parsedFrom = addressparser(email.from);

  email.from = {
    name: (parsedFrom !== null ? parsedFrom.name : void 0) || '',
    email: (parsedFrom !== null ? parsedFrom.address : void 0) || email.from
  };

  if (email.from.name === '' || email.from.name === ' ') {
    email.from.name = email.from.email;
  }


  email.to = addressparser(email.to);
  email.cc = addressparser(email.cc);

  if (data.payload.parts[0]) {
    var parts = data.payload.parts;
    email.attachments = {};

    for (var k = 0; k < parts.length; k++) {
      var item = parts[k];
      if (item !== null || item !== undefined) {
        if (item.body !== null ? item.body.attachmentId : void 0) {
          email.attachments[k] = {
            filename: item.filename,
            attachmentId: item.body.attachmentId
          };
        }
        else if (item.mimeType === 'text/plain') {
          email.message = String(new Buffer(item.body.data, 'base64'));
        }
        else if (item.mimeType === 'text/html') {
          email.message = String(new Buffer(item.body.data, 'base64'));
        }
      }
    }
  }
  return cb(null, email);
};
