var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Page = new keystone.List('Page', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Page.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
    type: { type: Types.Select, options: 'public, dashboard', default: 'public' },
	image: { type: Types.CloudinaryImage },
	content: { type: Types.Html, wysiwyg: true, height: 400 }
});

Page.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Page.register();
