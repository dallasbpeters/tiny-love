var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'lesson';

	locals.title = 'Lesson';

	view.on('init', function(next) {

		if (!req.user || !req.user._id) {
			return res.redirect('/');
		}

		if (!req.user.payed && !req.user.isAdmin) {
			return res.redirect('/user/pay');
		}

		next();
	});

    view.on('init', function(next) {

        // Load the modules by sortOrder
    	keystone.list('Module').model.findOne({ key: req.params.module }).exec(function(err, result) {
            locals.module = result;

			next(err);
        });
    });

	view.on('init', function(next) {

		if (!locals.module || !locals.module.id) {
			res.redirect('/user/dashboard');
			return;
		}

        // Load the modules by sortOrder
    	keystone.list('Lesson').model.find({ module: locals.module.id }).sort('sortOrder').exec(function(err, results) {
            locals.lessons = results;

			for (var i = 0; i < locals.lessons.length; ++i) {
				if (locals.lessons[i].key === req.params.lesson) {
					if (locals.lessons.length > i + 1) {
						locals.nextLesson = locals.lessons[i+1];
					}
					else {
						locals.nextLesson = null;
					}

					break;
				}
			}

            next(err);
        });
    });

	view.on('init', function(next) {

		keystone.list('Lesson').model.findOne({ key: req.params.lesson }).exec(function(err, result) {
			locals.lesson = result;
			locals.title = result.name;
			next(err);
		});
    });

	// Render the view
	view.render('user/lesson');

};
