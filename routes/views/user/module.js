var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.title = 'Module';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'module';
	locals.module = {
		id: 0
	};
	locals.lessons = [];

	view.on('init', function(next) {

		if (!req.user || !req.user._id) {
			res.redirect('/');
		}
		else {
			next();
		}
	});

	view.on('init', function(next) {

        keystone.list('User').model.findOne({_id: req.user._id}).exec(function(err, result) {

            locals.currentUser = result;
            next(err);
        });
    });

    view.on('init', function(next) {

        // Load the modules by sortOrder
    	keystone.list('Module').model.findOne({ key: req.params.module }).exec(function(err, result) {

			if (err || result === null) {
				return res.redirect('/user/dashboard');
			}
            locals.module = result;
			locals.title = result.name;

            next(err);
        });
    });

	view.on('init', function(next) {

        // Load the lessons by sortOrder
    	keystone.list('Lesson').model.find({ module: locals.module.id }).exec(function(err, results) {
            locals.lessons = results;

			for (var i = 0; i < locals.lessons.length; ++i) {
				if (locals.currentUser.completedLessons.indexOf(locals.lessons[i]._id.toString()) !== -1) {
					locals.lessons[i].status = 'completed';
				}
				else {
					locals.lessons[i].status = 'uncompleted';
				}
			}

            next(err);
        });
    });

	// Render the view
	view.render('user/module');
};
