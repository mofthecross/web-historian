var fs = require('fs');
var http = require('http');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(error, data) {
    if (error) {
      console.log('Error reading sites.txt');
    } else {
      var arrayOfUrls = data.toString().split('\n');
      arrayOfUrls.pop();
      callback(arrayOfUrls);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(arrayOfUrls) {
    callback(_.contains(arrayOfUrls, url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls(function(arrayOfUrls) {
    arrayOfUrls.push(url);
    fs.writeFile(exports.paths.list, arrayOfUrls.join('\n') + '\n', function(error) {
      if (error) {
        console.log('Failed to add URL to the list');
      } else {
        console.log('URL has been added');
        callback();
      }
    });
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access(path.join(exports.paths.archivedSites, url), fs.R_OK, function(error) {
    callback(!error);
  });
};

// Only pass this function Urls that have already been downloaded
exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(url) {
    var options = {
      host: url,
      path: ''
    };
    http.get(options, function(response) {
      var bodyChunks = [];
      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
      });
      response.on('end', function() {
        var body = Buffer.concat(bodyChunks);

        fs.writeFile(path.join(exports.paths.archivedSites, url), body, function(error) {
          if (error) { throw error; }
        });
      });
    });
  });

  // Todo: handle http get errors
};
