import Cors from 'cors';
import initMiddleware from 'plugins/next-cors/middleware';
import diginext from './diginext.json';

let shortEnv = process.env.NEXT_PUBLIC_ENV;
if (process.env.NEXT_PUBLIC_ENV == 'development') shortEnv = 'dev';
if (process.env.NEXT_PUBLIC_ENV == 'production') shortEnv = 'prod';

const corsSettings = diginext.cors || { dev: [], prod: [] };
const whitelist = corsSettings[shortEnv] || [];

if (typeof window == 'undefined') console.log(`[CORS] Whitelist origins:`, whitelist);

function checkCors(origin, callback) {
    console.log(`[CORS] request origin:`, origin);
    // console.log(`[CORS] callback:`, callback);

    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        console.error('[CORS] Not allowed by CORS');
        // callback(null, false);
        return new Error(`CORS not allowed.`);
    }
}

var corsOptionsDelegate = function (req, callback) {
    // console.log(`[CORS] req.header:`, req.headers);
    var corsOptions = {
        origin: '*',
        allowedHeaders: '*',
        // allowedHeaders: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cache-Control, Body-Hash, Signature, Api-Key",
        methods: 'GET,OPTIONS,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };

    /**
     * Only allow from the specific domains:
     */
    const origin = req.header('Origin') || `${req.protocol}://${req.headers['host']}`;
    const isAllowed = whitelist.indexOf(origin) !== -1;
    // console.log(`[CORS] origin:`, origin);
    // console.log(`[CORS] isAllowed:`, isAllowed);

    if (isAllowed) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }

    callback(null, corsOptions); // callback expects two parameters: error and options
};

// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = initMiddleware(Cors(corsOptionsDelegate));

export const Environment = {
    PRODUCTION: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'development',
    CANARY: 'canary',
};

const CONFIG = {
    environment: process.env.NEXT_PUBLIC_ENV || 'development',
    site: {
        title: 'Diginext Website',
        description: 'Description goes here',
        type: 'article',
    },
    links: {
        facebookPage: '',
    },
    dateFormat: 'yyyy-MM-dd HH:mm:ss',
    // these variables can be exposed to front-end:
    NEXT_PUBLIC_FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID || '', // currently using XXX
    NEXT_PUBLIC_FB_PAGE_ID: process.env.NEXT_PUBLIC_FB_PAGE_ID || '1162214040532902', // currently using Digitop developers
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
    NEXT_PUBLIC_API_BASE_PATH: process.env.NEXT_PUBLIC_API_BASE_PATH || '',
    NEXT_PUBLIC_CDN_BASE_PATH: process.env.NEXT_PUBLIC_CDN_BASE_PATH || '',
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN || '',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || '',
    // some secret keys which won't be exposed to front-end:
    SOME_SECRET_KEY: process.env.SOME_SECRET_KEY || '',
    IRON_SESSION_NAME: 'DIGINEXTADMINCOOKIE',
    IRON_SESSION_SECRET: process.env.IRON_SESSION_SECRET || '',
    get SESSION_NAME() {
        return `DIGINEXTAPPCOOKIE`;
    },
    getBasePath: () => {
        return CONFIG.NEXT_PUBLIC_BASE_PATH ? '/' + CONFIG.NEXT_PUBLIC_BASE_PATH : '';
    },
    getBaseUrl: () => {
        return CONFIG.NEXT_PUBLIC_BASE_URL ? CONFIG.NEXT_PUBLIC_BASE_URL : '';
    },
    path: (path) => {
        return CONFIG.getBasePath() + path;
    },
};

if (typeof window != 'undefined') {
    window.__config__ = CONFIG;
    // console.log(CONFIG);
} else {
    // console.log(CONFIG);
}

export default CONFIG;
