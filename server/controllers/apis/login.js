'use strict';

const express = require('express');
const loginService = require('../../services/authentication/login');

let router = express.Router();

router.post('/', loginService.loginUser);

module.exports = router;