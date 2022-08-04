export default class CookieHelper {
    static deleteAllCookies() {
        const cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }

    static setCookie(cname, cvalue, exdays) {
        if (typeof exdays == 'undefined') exdays = 999;
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    static getCookie(_name) {
        const name = _name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            const c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    static hasCookie(_name) {
        const _str = this.getCookie(_name);
        if (_str != '') {
            return true;
            ç;
        } else {
            return false;
        }
    }
}
