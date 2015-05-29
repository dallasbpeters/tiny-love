var keystone = require('keystone');

exports = module.exports = function(req, res) {

	if (req.user) {
		return res.redirect('/dashboard');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'user';
	locals.form = req.body;

	view.on('post', { action: 'join' }, function(next) {

		if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
			req.flash('error', 'Please enter a name, email and password.');
			return next();
		}

		keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

			if (err || user) {
				req.flash('error', 'A user already exists with that email address.  Please try logging in.');
				return next();
			}

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
					req.flash('error', 'We are having trouble creating your user record.  Please contact us directly.');
					return next();
				}

				var onSuccess = function() {

					res.redirect('/dashboard');
				};

				var onFail = function(err) {

					console.log(err);
					req.flash('error', 'There was a problem signing you in, please try again.');
					return next();
				};

				keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			});
		});
	});
};
