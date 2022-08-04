import chalk, { red } from 'chalk';
import dayjs from 'dayjs';

const log = (...msg) => {
    // const msgs = [];
    console.log(chalk.blue(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`), ...msg);
    // console.dir(msgs, { depth: null, colors: true, maxArrayLength: null });
};

const logFull = (data = {}) => {
    console.dir(data, { depth: null, colors: true, maxArrayLength: null });
};

const logRes = (res, ...msg) => {
    console.warn(chalk.blue(`[${res.status ? 'SUCCESS' : 'FAILED'}]`), ...msg, res);
};

const logError = (...msg) => {
    console.error(chalk.bgRed(chalk.white(`[ERROR ${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`)), chalk.red(...msg));
};

const logWarn = (...msg) => {
    console.warn(chalk.yellow(`[WARN ${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`, ...msg));
};

const logSuccess = (...msg) => {
    console.info(chalk.green(`[SUCCESS ${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`, ...msg));
};

export { log, logFull, logRes, logError, logWarn, logSuccess };
