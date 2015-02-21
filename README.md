# parse-gmail-email
[![Build Status](https://travis-ci.org/stevelacy/parse-gmail-email.png?branch=master)](https://travis-ci.org/stevelacy/parse-gmail-email)
[![NPM version](https://badge.fury.io/js/parse-gmail-email.png)](http://badge.fury.io/js/parse-gmail-email)


Parse gmail API emails



```js
var parse = require('parse-gmail-email');


email = 'Your full gmail API email'

parse(email, function(err, data) {
  // =>
  /*
  {
    subject: 'Subject here',
    from: { name: 'Steve Lacy', address: 'me@slacy.me' },
    to: [ { address: 'me@slacy.me', name: 'Steve Lacy' } ],
    cc: [
        { address: 'test@test.com', name: '' },
        { address: 'funkytek@wearefractal.com', name: 'Aaron Murray' }
    ],
    id: '14b9d36df0e',
    threadId: '14b9d3694f7',
    labelIds: [ 'INBOX', 'CATEGORY_UPDATES' ],
    snippet: 'this is a snippet',
    attachments: {
      '2': {
        filename: 'great-websites.md', attachmentId: 'SUCHIDHERE'
      }
    },
    message: 'This is the message'
  }

  */
});


```
