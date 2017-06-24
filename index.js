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

  var date = new Date(Number(data.internalDate));
  if (isNaN(date.getTime())) {
    return cb(new Error('email missing date'));
  }

  var email = {
    labelIds: data.labelIds,
    date: date,
  };

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
    if (header.name && header.name === 'Bcc') {
      email.bcc = header.value;
    }
  }

  var parsedFrom = addressparser(email.from)[0];
  email.from = {
    name: parsedFrom.name || '',
    address: parsedFrom.address.toLowerCase()
  };
  if (email.from.name === '' || email.from.name === ' ') {
    email.from.name = email.from.address.toLowerCase();
  }

  email.to = addressparser(email.to);
  for (var u = 0; u < email.to.length; u++) {
    email.to[u].address = email.to[u].address.toLowerCase();
  }

  email.cc = addressparser(email.cc);
  for (var w = 0; w < email.cc.length; w++) {
    email.cc[w].address = email.cc[w].address.toLowerCase();
  }

  email.bcc = addressparser(email.bcc);
  for (var w = 0; w < email.bcc.length; w++) {
    email.bcc[w].address = email.bcc[w].address.toLowerCase();
  }

  if (data.payload.parts && data.payload.parts[0]) {
    var parts = data.payload.parts;
    email.attachments = [];

    for (var k = 0; k < parts.length; k++) {
      var item = parts[k];
      if (item !== null || item !== undefined) {
        if (item.body !== null ? item.body.attachmentId : void 0) {
          email.attachments.push({
            filename: item.filename,
            mimetype: item.mimeType,
            id: item.body.attachmentId,
            size: item.body.size
          });
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
