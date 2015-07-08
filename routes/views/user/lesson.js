var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'lesson';

    view.on('init', function(next) {

        // Load the modules by sortOrder
    	keystone.list('Module').model.findOne({ key: req.params.module }).exec(function(err, result) {
            locals.module = result;

            keystone.list('Lesson').model.findOne({ key: req.params.lesson }).exec(function(err, result) {
                locals.lesson = result;
                next(err);
            });
        });
    });

	// Render the view
	view.render('user/lesson');

};
