import fs from 'fs';
import path from 'path';

const getResource = (filePath) => {
    return fs.readFileSync(path.resolve(`.${filePath}`), 'utf-8');
};

export { getResource };
