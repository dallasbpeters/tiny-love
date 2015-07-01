var keystone = require('keystone');
var session = keystone.session;

exports = module.exports = function(req, res) {

    console.log('signin');

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.submitted = req.body;
    locals.from = req.query.from;
    locals.csrf_token_key = keystone.security.csrf.TOKEN_KEY;
    locals.csrf_token_value = keystone.security.csrf.getToken(req, res);
    locals.csrf_query = '&' + keystone.security.csrf.TOKEN_KEY + '=' + keystone.security.csrf.getToken(req, res);


	// If a form was submitted, process the login attempt
	if (req.method === 'POST') {

		if (!keystone.security.csrf.validate(req)) {
			req.flash('error', 'There was an error with your request, please try again.');
			return view.render('user/signin');
		}

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email address and password.');
			return view.render('user/signin');
		}

		var onSuccess = function (user) {

			if (req.query.from && req.query.from.match(/^(?!http|\/\/|javascript).+/)) {
				res.redirect(req.query.from);
			} else if ('string' === typeof keystone.get('signin redirect')) {
				res.redirect(keystone.get('signin redirect'));
			} else if ('function' === typeof keystone.get('signin redirect')) {
				keystone.get('signin redirect')(user, req, res);
			} else {
				res.redirect('/user/dashboard');
			}

		};

		var onFail = function (err) {
			var message = (err && err.message) ? err.message : 'Sorry, that email and password combo are not valid.';
			req.flash('error', message );
			view.render('user/signin');
		};

		session.signin(req.body, req, res, onSuccess, onFail);

	} else {
		view.render('user/signin');
	}

};
