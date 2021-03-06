var keystone = require('keystone');

var Module = new keystone.List('Module', {
	autokey: { from: 'name', path: 'key', unique: true },
	sortable: true
});

Module.add({
	name: { type: String, required: true }
});

Module.relationship({ path: 'lessons', ref: 'Lesson', refPath: 'module' });
Module.defaultColumns = 'name';

Module.register();
