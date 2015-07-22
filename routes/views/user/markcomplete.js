var keystone = require('keystone');

exports = module.exports = function(req, res) {

	if (!req.user || !req.user._id) {
		return res.redirect('/');
	}

    if (req.params.id && req.query.next) {
        keystone.list('Lesson').model.findOne({ _id: req.params.id }).exec(function (err, lesson) {

            if (err) {
                console.log(err);
            }

            keystone.list('User').model.findOne({ _id: req.user._id }).exec(function(err, user) {

                if (err) {
                    console.log(err);
                }

                user.completedLessons.push(lesson._id);
                user.save(function (err) {

                    if (err) {
                        console.log(err);
                    }

                    res.redirect(req.query.next);
                });
            });
		});
    }



};
