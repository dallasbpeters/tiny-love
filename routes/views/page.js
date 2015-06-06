var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// Set locals
	locals.section = 'page';
	locals.filters = {
		page: req.params.page
	};
	locals.data = {};

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Page').model.findOne({
			state: 'published',
			slug: locals.filters.page
		}).populate('author');

		q.exec(function(err, result) {
			locals.data.page = result;
			next(err);
		});
	});

	// Render the view
	view.render('page');

};