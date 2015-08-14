var keystone = require('keystone');
var Types = keystone.Field.Types;

var Lesson = new keystone.List('Lesson', {
	autokey: { from: 'name', path: 'key', unique: true },
	sortable: true,
	sortContext: 'Module:lessons'
});

Lesson.add({
	name: { type: String, required: true },
	module: { type: Types.Relationship, ref: 'Module' },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
	supplemental: { type: Types.Html, wysiwyg: true, height: 200 }
});

Lesson.defaultColumns = 'module, state';
Lesson.register();
