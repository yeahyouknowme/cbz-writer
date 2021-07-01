importScripts('./uncompress/uncompress.js')
importScripts('./validate-mime.js');





loadArchiveFormats(['rar', 'zip'], function(){
    self.postMessage({ action: "ready"});
    console.info("Worker ready...");
})