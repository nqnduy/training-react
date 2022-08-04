import ApiCall from 'modules/ApiCall';
import CONFIG from 'web.config';
export default class PostError {
    static async send(data) {
        const res = await ApiCall({
            url: CONFIG.getBaseUrl() + '/api/log/handle-error',
            data,
            method: 'POST',
        });
        console.log(`PostError send`, res);
        return;
    }
}
