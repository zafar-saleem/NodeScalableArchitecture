'use strict';

const express = require('express');
const registerService = require('../../services/authentication/register');

let router = express.Router();

router.post('/', registerService.registerUser);

module.exports = router;
