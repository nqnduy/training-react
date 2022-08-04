import Axios from 'axios';
import CONFIG from 'web.config';
import qs from 'querystring';
import { trackingFormData, trackingFormUrl } from '@/helpers/helpers';

// import FormData from "form-data";
let FormData;
if (typeof window == 'undefined') {
    FormData = require('form-data');
} else {
    FormData = window.FormData;
}

const ApiCall = async ({ url, path, method = 'GET', data = {}, token, router, contentType = null, headers = {}, params = {} }) => {
    let api;
    let axiosOption = {
        url: url ? url : CONFIG.NEXT_PUBLIC_API_BASE_PATH + path,
        method: method,
        headers: { ...headers },
        params: { ...params },
    };

    console.log(`axiosOption`, axiosOption);
    if (method.toUpperCase() == 'GET') {
    } else if (contentType == 1) {
        var form = new FormData();
        trackingFormData(form, data);
        axiosOption.headers = {
            ...axiosOption.headers,
            'Content-Type': 'multipart/form-data',
        };
        axiosOption.maxBodyLength = Infinity;
        axiosOption.maxContentLength = Infinity;
        axiosOption.data = form;
    } else if (contentType == 'uploadImage') {
        axiosOption.headers = {
            ...axiosOption.headers,
            'Content-Type': 'multipart/form-data',
        };
        axiosOption.maxBodyLength = Infinity;
        axiosOption.maxContentLength = Infinity;
        let FormData = require('form-data');
        var form = new FormData();
        form.append('image', data, 'image.jpg');
        axiosOption.data = form;
    } else if (contentType == 'uploadBlob') {
        const { key, value, name } = data;
        axiosOption.headers = {
            ...axiosOption.headers,
            'Content-Type': 'multipart/form-data',
        };
        axiosOption.maxBodyLength = Infinity;
        axiosOption.maxContentLength = Infinity;
        let FormData = require('form-data');
        var form = new FormData();
        form.append(key, value, name);
        axiosOption.data = form;
    } else {
        var form = {};
        trackingFormUrl(form, data);
        axiosOption.headers = {
            ...axiosOption.headers,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        axiosOption.data = qs.stringify(form);
    }

    if (token) axiosOption.headers['Authorization'] = 'Bearer ' + token;

    try {
        api = await Axios(axiosOption);
    } catch (e) {
        api = e.response;
    }

    if (!api) {
        api = {
            data: {
                status: false,
                message: `[API ERROR - ${method.toUpperCase()}] Can't connect with [${path}]. Please contact your IT service for support.`,
                data: {},
            },
        };
    } else if (api && api.data && api.data.statusCode == 401 && router) {
        router.push('/admin/logout');
    } else {
        return api.data;
    }

    return api;
};

const ApiLogout = async ({ token }) => {
    let api = await ApiCall({
        path: '/api/v1/auth/users/logout',
        token: token,
    });

    return api;
};

export { ApiLogout };

export default ApiCall;
