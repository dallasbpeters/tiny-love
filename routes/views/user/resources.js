var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

    locals.title = 'Resources';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'resources';

    view.on('init', function(next) {

		var q = keystone.list('Page').model.findOne({
			state: 'published',
			title: 'Resources'
		});

		q.exec(function(err, result) {
			locals.page = result;

			next(err);
		});
	});

	// Render the view
	view.render('user/resources');

};
