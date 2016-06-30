var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds
};

var knownContentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.txt': 'text/plain'
};
var DEFAULT_CONTENT_TYPE = 'text/html';

var siteAssetPaths = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/loading.html': 'loading.html',
  '/styles.css': 'styles.css'
};

exports.serveAssets = function(response, asset, callback) {
  var containingPath = archive.paths[asset in siteAssetPaths ? 'siteAssets' : 'archivedSites'];
  var fileName = asset in siteAssetPaths ? siteAssetPaths[asset] : asset;
  var absolutePath = path.join(containingPath, fileName);
  var extension = path.extname(absolutePath);

  fs.readFile(absolutePath, function(error, data) {
    var statusCode, responseData;
    var headers = Object.assign({}, exports.headers);

    if (error) {
      statusCode = 404;
      responseData = 'file not found!';
    } else {
      statusCode = 200;
      headers['Content-Type'] = extension in knownContentTypes ? knownContentTypes[extension] : DEFAULT_CONTENT_TYPE;
      responseData = data.toString();
    }

    response.writeHead(statusCode, headers);
    response.end(responseData);
    callback();
  });
};



  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!
