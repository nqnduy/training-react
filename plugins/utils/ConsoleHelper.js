import pkg from 'package.json';

export default class ConsoleHelper {
    static showCredit() {
        console.log(`Version ${pkg.version} | Developed by Digitop | https://wearetopgroup.com/`);
    }

    static disable() {
        for (var i in console) {
            console[i] = function () {};
        }
    }

    static handleError() {
        if (typeof window == 'undefined') return;

        window.onerror = function (message, source, lineno, colno, error) {
            ConsoleHelper.sendError({ message, source, lineno, colno, error });
        };
    }

    static async sendError(e) {
        if (typeof window == 'undefined') return;

        const DeviceHelper = (await import('plugins/utils/DeviceHelper')).default;
        const deviceInfo = DeviceHelper.checkOS() || {};

        let data = {
            deviceInfo: { ...deviceInfo },
        };
        if (typeof e == 'string') {
            data = {
                message: e,
                ...data,
            };
        } else {
            data = {
                ...e,
                ...data,
            };
        }

        const PostError = (await import('plugins/log/PostError')).default;
        PostError.send(data);
    }
}
