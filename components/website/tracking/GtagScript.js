import { isArray } from 'lodash';
import renderHTML from 'react-render-html';
import diginext from 'diginext.json';

const gaIds = [];
if (diginext.ga) {
    Object.entries(diginext.ga)
        .map(([key, val]) => val)
        .map((id) => gaIds.push(id));
}

/**
 * @param  {String|[String]} id
 */
const scriptContent = (id) => {
    if (isArray(id)) {
        const gtagConf = id.map((_id) => `  gtag('config', '${_id}');`).join('\n');
        // console.log(`gtagConf`, gtagConf);
        return `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id[0]}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
${gtagConf}
</script>
<!-- End Google Tag Manager -->
`;
    } else {
        return `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>
<!-- End Google Tag Manager -->
`;
    }
};

const noscriptContent = (id) => `
<!-- Google Tag Manager (noscript) -->
<iframe
  src="https://www.googletagmanager.com/ns.html?id=${id}"
  height="0"
  width="0"
  style="display:none;visibility:hidden"
></iframe>
<!-- End Google Tag Manager (noscript) -->
`;

/**
 * @param  {Object} props
 * @param  {String|[String]} [props.id] - Google Tag Manager ID (or array)
 */
function GtagScript({ id }) {
    let inputIds = id || gaIds;
    GtagScript.ID = isArray(inputIds) ? inputIds[0] : inputIds;
    return renderHTML(scriptContent(inputIds));
}

/**
 * Track page view of the website
 * @param  {String} path - Page path to be tracked
 * @param  {String} [title="Not specified"] - Page title to be tracked
 * @example
 * GtagScript.page("/home", "Home page");
 */
GtagScript.page = (path, title = 'Not specified') => {
    try {
        gtag('config', GtagScript.ID, {
            page_title: title,
            page_path: path,
        });
    } catch (e) {
        console.warn(`[GaTracking] Track page "${path}" failed.`);
    }
};

/**
 * Track event of the website
 * @param  {String} category - Event category.
 * @param  {String} [action=""] - Event action
 * @param  {String} [label=""] - Event label
 * @example
 * GtagScript.event("interaction", "click", "View more");
 */
GtagScript.event = (category, action = '', label = '') => {
    try {
        gtag('event', action, {
            event_category: category,
            event_label: label,
        });
    } catch (e) {
        console.warn(`[GaTracking] Track event "Category: ${category} > Action: ${action} > Label: ${label}" failed.`);
    }
};

export const GaTrackingNoscript = ({ id }) => {
    return <noscript>{renderHTML(noscriptContent(id))}</noscript>;
};

export default GtagScript;
