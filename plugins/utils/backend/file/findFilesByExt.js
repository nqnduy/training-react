var path = require('path');
var fs = require('fs');

/**
 *
 * @param {string} base
 * @param {string} ext
 * @param {Function} cb
 */
const forEachFileByExt = (base, ext, cb) => {
    var walk = function (directoryName) {
        try {
            fs.readdir(directoryName, function (e, files) {
                if (e) {
                    console.log('Error: ', e);
                    return;
                }
                files.forEach(function (file) {
                    var fullPath = path.join(directoryName, file);
                    fs.stat(fullPath, function (e, f) {
                        if (e) {
                            console.log('Error: ', e);
                            return;
                        }
                        if (f.isDirectory()) {
                            walk(fullPath);
                        } else {
                            if (fullPath.toLowerCase().indexOf(ext.toLowerCase()) > -1) {
                                if (cb) cb(fullPath);
                            }
                        }
                    });
                });
            });
        } catch (error) {
            console.log('error', error);
        }
    };
    walk(base);
};

export default forEachFileByExt;
