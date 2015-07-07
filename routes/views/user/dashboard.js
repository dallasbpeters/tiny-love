var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'dashboard';

	// Load the modules by sortOrder
	view.query('modules', keystone.list('Module').model.find().sort('sortOrder'));

	// Render the view
	view.render('user/dashboard');

};
