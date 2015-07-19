var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.title = 'Forgot Password';

    locals.submitted = req.body;
    if (!locals.submitted.email && req.cookies.email) {
        locals.submitted.email = req.cookies.email;
    }

    locals.csrf_token_key = keystone.security.csrf.TOKEN_KEY;
    locals.csrf_token_value = keystone.security.csrf.getToken(req, res);
    locals.csrf_query = '&' + keystone.security.csrf.TOKEN_KEY + '=' + keystone.security.csrf.getToken(req, res);

    view.on('post', { action: 'forgot' }, function(next) {

        if (!keystone.security.csrf.validate(req)) {
            req.flash('error', 'There was an error with your request, please try again.');
            return next();
        }

        if (!req.body.email) {
            req.flash('error', 'Please enter your email address.');
            return next();
        }

        keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

			if (err || user === null) {
				req.flash('error', 'We could not find a user with that email address.  Did you use a different email address?');
				return next();
			}

            locals.user = user;
            var key = Math.round(Math.random() * 10000000);

            user.oneTimeLoginKey = key;
            user.save(function (err) {

                if (err) {
    				req.flash('error', 'There was a problem setting up your one time login link.  Please contact us about that.');
    				return next();
    			}

                // send out the new signup email.
                new keystone.Email('forgot').send({
                    to: user.email,
                    from: {
                        name: 'Tiny Love',
                        email: 'mark.bradshaw@gmail.com'
                    },
                    subject: 'Forgot Password on Tiny Love',
                    key: key,
                    name: user.name
                }, function(err) {

                    if (err) {
                        console.log('email error', err);
                        req.flash('error', 'There was a problem sending your login link to you.  Please contact us about that.');
        				return next();
                    }

                    locals.done = true;
                    next();
                });
            });
        });
    });

    view.render('user/forgot');
};
