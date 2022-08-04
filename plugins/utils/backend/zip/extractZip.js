import JSZip from 'jszip';
import ObjectExtra from 'plugins/utils/ObjectExtra';
import createDir from '../file/createDir';
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {string} zipPath
 * @param {string} directory
 * @param {Function} forEach
 */
const extractZip = async (zipPath, directory, forEach) => {
    // let id = -1;
    // let isCallcb = false;
    fs.readFile(zipPath, async function (err, data) {
        if (err) throw err;
        JSZip.loadAsync(data)
            .then(async function (zip) {
                const _length = ObjectExtra.toArray(zip).length;
                zip.forEach((filePath, fileObj) => {
                    console.log(filePath);
                    var fileName = path.resolve(directory, filePath);
                    if (fileName.indexOf('.DS_Store') >= 0) {
                        return;
                    }
                    if (fileName.indexOf('__MACOSX/') >= 0) {
                        return;
                    }

                    // (fileName)
                    if (fileObj.dir) {
                        createDir(fileName);
                        if (forEach) forEach(fileName, false);
                    } else {
                        try {
                            fileObj.async('nodebuffer').then((buff) => {
                                fs.writeFileSync(fileName, buff);
                                if (forEach) forEach(fileName, true);

                                // id++;
                                // if (id >= _length) if (callback && !isCallcb) {
                                //     console.log("4")
                                //     isCallcb = true;
                                //     if (callback) callback();
                                // }
                            });
                        } catch (error) {
                            cosole.log('extractZip ERROR', error);
                        }
                    }
                });
            })
            .then(function () {});
    });
};

export default extractZip;
