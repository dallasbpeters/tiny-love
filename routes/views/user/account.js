var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

    locals.title = 'Account';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'account';

    view.on('post', { action: 'changePassword' }, function(next) {

        if (req.body.newpass === '') {
            req.flash('error', 'Please enter a new password.');
            return next();
        }

        keystone.list('User').model.findOne({_id: req.user._id}).exec(function(err, user) {

            user.password = req.body.newpass;
            user.save(function(err) {

                if (err) {
					console.log('update password error', err);
					req.flash('error', 'There was a problem updating your password.  Please contact us for assistance.');
					return next();
				}

                res.redirect('/user/dashboard');
            });
        });
    });

	// Render the view
	view.render('user/account');
};
