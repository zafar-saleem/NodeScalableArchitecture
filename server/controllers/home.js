'use strict';

function index(request, response) {
  response.json('This is home route');
}

module.exports = {
  index: index
};
