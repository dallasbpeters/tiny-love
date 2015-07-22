var keystone = require('keystone');
var session = keystone.session;

exports = module.exports = function(req, res) {

    if (req.query.key) {
        keystone.list('User').model.findOne({ oneTimeLoginKey: req.query.key }, function(err, user) {

            if (err || user === null) {
                console.log(err);
                return res.redirect('/user/login');
            }

            user.oneTimeLoginKey = null;
            user.save(function(err) {

                if (err || user === null) {
                    console.log(err);
                    return res.redirect('/user/login');
                }

                session.signinWithUser(user, req, res, function() {

                    res.redirect('/user/account');
                });
            });
        });
    }
    else {
        res.redirect('/user/login');
    }
};
