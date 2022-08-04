import Axios from 'axios';
import { withIronSession } from 'next-iron-session';
import { SessionConfig } from 'plugins/next-session';
import CONFIG from 'web.config';
import qs from 'querystring';

export default withIronSession(async (req, res) => {
    // console.log(req.headers);
    // console.log(req.url);

    let response = { status: 0, messages: [], data: {} };
    let user = req.session.get('user');
    // console.log(user);
    if (user) {
        const token = user.token;
        const body = req.body;
        const path = req.url.replace('/api/proxy', '');
        const method = req.method.toLowerCase();
        const url = `${CONFIG.NEXT_PUBLIC_API_BASE_PATH}${path}`;

        let headers = {};
        headers['Authentication'] = `Bearer ${token}`;
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

        let apiRes;
        let options = { headers, url, method };

        if (['post', 'put', 'delete', 'patch'].includes(method)) {
            if (body) options.data = qs.stringify(body);
        }

        try {
            // console.log(options);
            apiRes = await Axios(options);
            // console.log(apiRes.data);
            return res.status(200).json(apiRes.data);
        } catch (e) {
            // console.log(e);
            console.log(`[ERROR ${e.response.status}] ${e.response.statusText}`);
            response.messages.push(e.response.statusText);
            return res.status(e.response.status).json(response);
        }
    } else {
        response.messages.push('Out of session.');
        return res.status(403).json(response);
    }
}, SessionConfig);
