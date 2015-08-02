'use strict';

//https://developer.paypal.com/webapps/developer/applications/accounts

var keystone = require('keystone');
var querystring = require('querystring');
var request = require('request');

exports = module.exports = function(req, res) {

	// console.log('req body', req.body);

	res.end(''); // blank 200 response immediately to the sender

	//https://developer.paypal.com/developer/ipnSimulator
	// Now, send out a POST to paypal to verify what we got.
	var postreq = 'cmd=_notify-validate';
	for (var key in req.body) {
		if (req.body.hasOwnProperty(key)) {
			var value = querystring.escape(req.body[key]);
			postreq = postreq + '&' + key + '=' + value;
		}
	}

	var options = {
		url: 'https://www.paypal.com/cgi-bin/webscr',
		method: 'POST',
		headers: {
			'Connection': 'close'
		},
		body: postreq,
		strictSSL: true,
		rejectUnauthorized: false,
		requestCert: true,
		agent: false
	};

	request(options, function callback(error, response, body) {

		if (!error && response.statusCode === 200) {
			if (body.substring(0, 8) === 'VERIFIED') {
				var paymentStatus = req.body.payment_status;
				var payerEmail = req.body.payer_email;
				console.log('got a good payment:', paymentStatus, '-', payerEmail);

				keystone.list('User').model.findOne({email: payerEmail}, function(err, user) {

					if (err || !user) {
						console.log('The payment went through, but there was a user error.');
						return;
					}

					user.payed = true;
					user.save(function(errSave) {

						if (errSave) {
							console.log('The payment went through, but there was a problem marking your account as payed.  Please contact us to get this fixed!');
							return;
						}
					});
				});
				return;
			}

		}

		console.log('bad payment');

	});
};
