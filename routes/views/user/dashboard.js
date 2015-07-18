var async = require('async');
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

    view.on('init', function(next) {

        keystone.list('User').model.findOne({_id: req.user._id}).exec(function(err, result) {

            currentUser = result;
            next(err);
        });
    });

    view.on('init', function(next) {

        // Load the modules by sortOrder
    	keystone.list('Module').model.find().sort('sortOrder').exec(function(err, results) {

            locals.modules = results;
            next(err);
        });
    });

    view.on('init', function(next) {

        var foundCurrent = false;
        async.eachSeries(locals.modules, function(module, iteratorCallback) {

            keystone.list('Lesson').model.find({module: module.id}).sort('sortOrder').exec(function(err, lessons) {

                if (lessons.every(function(lesson) {
                    return currentUser.completedLessons.indexOf(lesson.id) !== -1;
                })) {
                    module.status = 'completed';
                }
                else {
                    if (!foundCurrent) {
                        module.status = 'current';
                        foundCurrent = true;
                    }
                    else {
                        module.status = 'disabled';
                    }
                }
                iteratorCallback(err);
            });
        }, next);
    });


	// Render the view
	view.render('user/dashboard');

};
