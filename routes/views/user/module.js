var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'module';

    view.on('init', function(next) {

        // Load the modules by sortOrder
    	keystone.list('Module').model.findOne({ key: req.params.module }).exec(function(err, result) {
            locals.module = result;

            // Load the modules by sortOrder
        	keystone.list('Lesson').model.find({ module: locals.module.id }).exec(function(err, results) {
                locals.lessons = results;
                next(err);
            });
        });
    });

	// Render the view
	view.render('user/module');

};
