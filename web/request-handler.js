var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function(request, response) {
  if (request.method === 'GET') {
    httpHelpers.serveAssets(response, request.url, function() {
      console.log('serveAssets was successful!');
    });
  } else if (request.method === 'POST') {
    // user types URL in input box
    // receive the POST request from the client (url-encoded)
    var requestedURL;

    var urlEncodedString = '';
    request.on('data', function(data) {
      urlEncodedString += data;
    });
    request.on('end', function() {
      urlEncodedString = urlEncodedString.split('=')[1];

      archive.isUrlInList(urlEncodedString, function(isInList) {
        var sendRedirect = function() {
          archive.isUrlArchived(urlEncodedString, function(isArchived) {
            response.writeHead(302, {Location: '/' + isArchived ? urlEncodedString : 'loading.html'});
            response.end();
          });
        };

        if (!isInList) {
          archive.addUrlToList(urlEncodedString, sendRedirect);
        } else {
          sendRedirect();
        }
      });

    });
  }
};
