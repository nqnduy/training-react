import 'styles/tailwind.css';

/**
 * !!!!!!!!! IMPORTANT !!!!!!!!!
 * DO NOT ADD GLOBAL CSS HERE
 */

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;

async function init() {
    const ConfigLive = (await import('plugins/utils/ConfigLive')).ConfigLive;
    ConfigLive.consoleHandle();
}

init();
