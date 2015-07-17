// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'Tiny Love',
	'brand': 'Tiny Love',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'wysiwyg cloudinary images' : true,
	// TODO: rethink how to pull in the styles for the WYSIWYG for more accurate authoring
	// 'wysiwyg importcss' : "/css/site.css",
	'wysiwyg additional buttons': 'blockquote, formatselect, media',
	'wysiwyg additional plugins': 'media',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'J>+6}y`k_kl3"x-7L@efg<<dzi@y7yb%=TFqA)3{cVo*_ED%Sm7[GqvVH^8Ce;,W'

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Custom signin URL
keystone.set('signin url', '/user/signin');

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo.png',
	logo_width: 71,
	logo_height: 49,
	theme: {
		email_bg: '#F6F3F1',
		link_color: '#ee6556',
		buttons: {
			color: '#fff',
			background_color: '#ee6556',
			border_color: '#ee6556'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'modules': ['modules', 'lessons'],
	'users': 'users',
	'pages': 'pages'
});

// keystone.set('nav', {
// 	'posts': ['posts', 'post-categories'],
// 	'galleries': 'galleries',
// 	'enquiries': 'enquiries',
// 	'users': 'users',
// 	'pages': 'pages'
// });

// Start Keystone to connect to your database and initialise the web server

keystone.start();
