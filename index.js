'use strict';

const server = require('./server')();
const config = require('./configs');
const db = require('./configs/db');

server.create(config, db);
server.start();