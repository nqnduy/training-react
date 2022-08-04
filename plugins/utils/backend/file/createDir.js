const fs = require('fs');

/**
 *
 * @param {string} path
 */
export default function createDir(path) {
    if (fs.existsSync(path)) {
        console.log('directory already exited !');
        return true;
    }
    fs.mkdirSync(path, { recursive: true });
}
