var should = require('should');
var parseEmail = require('../');

var email = require('./fixtures/email.json');
var emailGroup = require('./fixtures/email-group.json');

describe('parseEmail', function() {

  it('should parse the google email data to a usable object', function(done) {
    parseEmail(email, function(err, data) {
      should(err).equal(null);
      should.exist(data);
      should.exist(data.headers);
      should.exist(data.from.name);
      should.exist(data.from.address);
      should.exist(data.to);
      should.exist(data.to[0]);
      should.exist(data.message);
      should.exist(data.snippet);
      should.exist(data.attachments);

      done();
    });
  });

  it('should keep the original headers', function(done) {
    parseEmail(email, function(err, data) {
      should.exist(data.headers);
      should.exist(data.headers['Delivered-To']);
      should.exist(data.headers.Received);
      should.exist(data.headers.Subject);
      should.exist(data.headers.From);
      should.exist(data.headers.To);
      should.exist(data.headers.Cc);
      should.exist(data.headers.Date);

      done();
    });
  });

  it('should correctly parse CCs', function(done) {
    parseEmail(email, function(err, data) {
      should.exist(data.cc);
      should.exist(data.cc[0]);
      should.exist(data.cc[1]);
      should.exist(data.cc[0].address);
      should.exist(data.cc[0].name);
      should(data.cc[0].address).equal('test@test.com');
      should(data.cc[0].address).equal('test@test.com');
      should(data.cc[1].address).equal('funkytek@wearefractal.com');

      done();
    });
  });

  it('should correctly parse subject and message', function(done) {
    parseEmail(email, function(err, data) {
      should.exist(data.message);
      should.exist(data.subject);
      should.equal(data.subject, 'Subject here');
      should(data.message).be.type('string');

      done();
    });
  });

  it('should correctly parse from', function(done) {
    parseEmail(email, function(err, data) {
      should.exist(data.from);
      should.equal(data.from.address, 'me@slacy.me');
      should.equal(data.from.name, 'Steve Lacy');

      done();
    });
  });

  it('should correctly parse to', function(done) {
    parseEmail(email, function(err, data) {
      should.exist(data.to);
      should.equal(data.to[0].address, 'me@slacy.me');
      should.equal(data.to[0].name, 'Steve Lacy');

      done();
    });
  });

  it('should correctly place attachment ids and filenames', function(done) {
    parseEmail(email, function(err, data) {
      should.exist(data.attachments['2']);
      should.exist(data.attachments['2'].filename);
      should(data.attachments['2'].filename).equal('great-websites.md');
      should(data.attachments['2'].attachmentId).equal('SUCHIDHERE');

      done();
    });
  });

  it('should correctly parse to groups', function(done) {
    parseEmail(emailGroup, function(err, data) {
      should.exist(data.to);
      should.exist(data.to[0]);
      should.exist(data.to[1]);
      should.exist(data.to[2]);

      done();
    });
  });

  it('should correctly parse label IDs', function(done) {
    parseEmail(emailGroup, function(err, data) {
      should.exist(data.labelIds);
      should(data.labelIds[0]).equal('INBOX', 'CATEGORY_UPDATES');

      done();
    });
  });

});


describe('parseEmail: Errors', function() {

  it('should return an error if no email', function(done) {
    parseEmail(null, function(err) {
      should.exist(err);
      should.exist(err.message);
      should(err.message).equal('email required');

      done();
    });
  });

  it('should return an error if no email payload', function(done) {
    parseEmail({}, function(err) {
      should.exist(err);
      should.exist(err.message);
      should(err.message).equal('email payload required');

      done();
    });
  });

  it('should return an error if no email headers', function(done) {
    parseEmail({payload: {}}, function(err) {
      should.exist(err);
      should.exist(err.message);
      should(err.message).equal('email headers required');

      done();
    });
  });

});
