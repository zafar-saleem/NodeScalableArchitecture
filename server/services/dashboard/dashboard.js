'use strict';

function getDashboard(request, response) {
  response.json('This is from dashboard');
}

module.exports = {
  getDashboard: getDashboard
}