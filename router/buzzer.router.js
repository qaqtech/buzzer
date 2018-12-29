var express = require('express');
var router = express.Router();
var redirect = require('../redirect/buzzer.redirect');

router.post('/load', redirect.load);

module.exports = router;