var keystone = require('keystone');
var request = require('request');
var session = keystone.session;

exports = module.exports = function(req, res) {

	console.log('signup');

	if (req.user) {
		return res.redirect('/');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.title = 'Sign up';

	locals.section = 'user';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	locals.noCaptcha = req.body.newDoula || false; // the name is just to obfuscate the form value
	locals.site_key = process.env.RECAPTCHA_SITE_KEY;
	locals.sk = process.env.RECAPTCHA_SECRET_KEY;

	function createUser(next) {
		var userData = {
			name: {
				first: req.body.firstname,
				last: req.body.lastname
			},
			email: req.body.email,
			password: req.body.password,

			website: req.body.website
		};

		var User = keystone.list('User').model,
		newUser = new User(userData);

		newUser.save(function(err) {

			if (err) {
				console.log('save error', err);
				req.flash('error', 'We are having trouble creating your account. Please contact us directly.');
				return next();
			}

			var onSuccess = function() {

				res.redirect('/user/pay');

				// send out the new signup email.
				new keystone.Email('signup').send({
					to: req.body.email,
					from: {
						name: 'Tiny Love',
						email: 'tinylove@beadoula.com'
					},
					subject: 'New Signup for Tiny Love',
					email: req.body.email,
					firstName: req.body.firstname
				}, function(err) {

					if (err) {
						console.log('email error', err);
					}
				});
			};

			var onFail = function (err) {

				console.log('fail', err);
				req.flash('error', 'There was a problem signing you in, please try again.');
				return next();
			};

			session.signin({
				email: req.body.email,
				password: req.body.password
			}, req, res, onSuccess, onFail);
		});
	}

	function checkForDuplicate(next) {

		keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

			if (err || user) {
				req.flash('error', 'A user already exists with that email address.  Please try logging in.');
				return next();
			}

			createUser(next);
		});
	}

	view.on('post', { action: 'signup' }, function(next) {

		if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
			req.flash('error', 'Please enter a name, email and password.');
			return next();
		}

		if (locals.noCaptcha) {
			checkForDuplicate(next);
		}
		else {
			var form = {
				secret: process.env.RECAPTCHA_SECRET_KEY,
				response: req.body['g-recaptcha-response'],
				remoteip: req.connection.remoteAddress
			};


			request.post({
				url: 'https://www.google.com/recaptcha/api/siteverify',
				form: form
			}, function optionalCallback(err, httpResponse, body) {

				// console.log('err', err, 'body', body);
				if (req.headers.host.indexOf('localhost') === -1 && (err || !body.sucess)) {
					req.flash('error', 'There was a problem validating your information.  Please try again or contact us.');
					return next();
				}
				else {
					locals.noCaptcha = true;
					checkForDuplicate(next);
				}
			});
		}
	});

	view.render('user/signup');
};
