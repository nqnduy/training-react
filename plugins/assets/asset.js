import CONFIG from 'web.config';
import framework from 'diginext.json';
import UrlUtils from '@/plugins/utils/UrlUtils';

const asset = (src) => {
    // console.log(CONFIG.NEXT_PUBLIC_CDN_BASE_PATH);
    // console.log(framework);

    let isEnabledCDN = false;
    if (CONFIG.environment == 'production') {
        isEnabledCDN = framework.cdn.prod;
    } else if (CONFIG.environment == 'staging') {
        isEnabledCDN = framework.cdn.staging;
    } else if (CONFIG.environment == 'development') {
        isEnabledCDN = framework.cdn.dev;
    } else {
        isEnabledCDN = false;
    }

    let isEnableBasePath = false;
    if (isEnabledCDN == false && CONFIG.NEXT_PUBLIC_BASE_PATH) {
        isEnableBasePath = true;
    }

    function getSrc() {
        if (isEnabledCDN) {
            src = src.replace(CONFIG.NEXT_PUBLIC_CDN_BASE_PATH + '/public', '');
            return CONFIG.NEXT_PUBLIC_CDN_BASE_PATH + '/public' + src;
        } else {
            if (isEnableBasePath) {
                src = src.replace('/' + CONFIG.NEXT_PUBLIC_BASE_PATH, '');
                return '/' + CONFIG.NEXT_PUBLIC_BASE_PATH + src;
            } else {
                return src;
            }
        }
    }

    src = getSrc();

    const isImage = UrlUtils.isImage(src);

    const __src = isImage ? UrlUtils.addQueryParam(src, 'version-cache', process.env.NEXT_PUBLIC_VERSION_CDN || '0') : src;
    return __src;
};

export default asset;
