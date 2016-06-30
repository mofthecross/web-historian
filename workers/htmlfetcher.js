var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(arrayOfUrls) {
  var urlsToDownload = [];
  var urlsChecked = 0;
  arrayOfUrls.forEach(function(url) {
    archive.isUrlArchived(url, function(isArchived) {
      if (!isArchived) {
        urlsToDownload.push(url);
        console.log('Will download', url);
      }

      urlsChecked++;
      if (arrayOfUrls.length === urlsChecked) {
        archive.downloadUrls(urlsToDownload);
      }
    });
  });
});
