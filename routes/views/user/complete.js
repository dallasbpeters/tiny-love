var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals,
        currentUser;

	locals.title = 'Dashboard';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'dashboard';

	if (!req.user) {
		res.redirect('/user/signin');
		return;
	}

    locals.showSurvey = true;

    view.on('init', function(next) {

        keystone.list('User').model.findOne({_id: req.user._id}).exec(function(err, result) {

            currentUser = result;
            if (currentUser.surveyAnswer !== undefined && currentUser.surveyAnswer !== '') {
                locals.showSurvey = false;
            }
            next(err);
        });
    });

    view.on('post', {}, function(next) {
        var questionNames = Object.keys(req.body);
        var surveyCombined = '';
        questionNames.forEach(function (name) {

            surveyCombined += name + ': ' + req.body[name] + '<br/>';
        });

        currentUser.surveyAnswer = surveyCombined;
        currentUser.save(next);
        locals.showSurvey = false;
    });

    // Render the view
	view.render('user/complete');

};
