const chalk = require('chalk');
const path = require('path');
const framework = require('./diginext.json');
var Table = require('cli-table');

const transpileModules = [
    // "react-spring",
    // "three",
    // "postProcessing"
];

const withTM = require('next-transpile-modules')(transpileModules);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

let appBasePath = '';
let isEnabledCDN = false;

if (process.env.NEXT_PUBLIC_ENV == 'production') {
    isEnabledCDN = framework.cdn.prod;
} else if (process.env.NEXT_PUBLIC_ENV == 'staging') {
    isEnabledCDN = framework.cdn.staging;
    if (framework.domain.staging.length == 0) {
        if (process.env.NEXT_PUBLIC_BASE_PATH) {
            appBasePath = `/${process.env.NEXT_PUBLIC_BASE_PATH}`;
        }
    }
} else if (process.env.NEXT_PUBLIC_ENV == 'development') {
    isEnabledCDN = framework.cdn.dev;
    if (process.env.NEXT_PUBLIC_BASE_PATH) appBasePath = `/${process.env.NEXT_PUBLIC_BASE_PATH}`;
} else {
    isEnabledCDN = false;
}

var table = new Table();
Object.entries(process.env)
    .filter(([key, value]) => key.includes('NEXT_PUBLIC'))
    .map((row) => {
        table.push(row);
    });
console.log(chalk.yellow('==== APPLICATION ENVIRONMENTS ===='));
console.log(table.toString());

let nextConfig = {
    eslint: {
        dirs: ['pages', 'components', 'plugins', 'modules'],
    },
    webpack(config, { dev, isServer }) {
        // for reading & parsing SVG files:
        config.module.rules.push({
            test: /\.svg$/i,
            exclude: [path.resolve('node_modules')],
            use: [
                {
                    loader: 'raw-loader',
                    options: {
                        esModule: false,
                    },
                },
            ],
        });

        return config;
    },
};

if (appBasePath.length > 0 && appBasePath != '/') nextConfig.basePath = appBasePath;

if (transpileModules.length > 0) {
    module.exports = withBundleAnalyzer(withTM(nextConfig));
} else {
    module.exports = withBundleAnalyzer(nextConfig);
}
