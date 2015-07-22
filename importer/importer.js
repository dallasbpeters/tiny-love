var FS = require('fs');
var Server = require('../server');
var Keystone = require('keystone');
var Async = require('async');

FS.readFile('tl-users.txt', 'utf8', function (err, data) {

  if (err) {
      throw err;
  }

  var User = Keystone.list('User').model;

  var lines = data.split("\n");

  Async.each(lines, function (line, next) {

      if (line === '') {
          return next();
      }

      var parts = line.split(',').map(function (part) {

         return part.replace(/'/g, '');
      });

      if (parts[0] === 'Username') {
          return next();
      }

      var userData = {
          name: {
              first: parts[3],
              last: parts[4]
          },
          email: parts[2],
          password: parts[1],
          payed: true
      };

      var newUser = new User(userData);

      newUser.save(function (err) {

         console.log('imported', parts[2]);
         if (err) {
             console.log(err);
         }

         next();
      });
  })
});
