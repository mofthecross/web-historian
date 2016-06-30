var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function(request, response) {
  if (request.method === 'GET') {
    httpHelpers.serveAssets(response, request.url, function() {
      console.log('serveAssets was successful!');
    });
  } else if (request.method === 'POST') {
    console.log(request.url);
    // user types URL in input box
    // receive the POST request from the client (url-encoded)
    var requestedURL;

    // if the submitted URL is not in the list of sites,
    if (!archive.isUrlInList(requestedURL)) {
      // add it to the list
      archive.addUrlToList(requestedURL);
    }
    // if the submitted URL's HTML is in data storage,
    if (archive.isUrlArchived(requestedURL)) {
      // auto-redirect the user to the page that serves up the archived file

    // else
    } else {
      // auto-redirect the user to the page loading.html to indicate that we don't have its content yet

    }


    // res.writeHead(301, {Location: 'http://new-website.com'});
    // res.end();
  }
};
