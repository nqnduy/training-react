import { defaultLocale } from '../constants/locale';

var self = (module.exports = {
    getObjectTrans: function (object, locale = defaultLocale) {
        return object && typeof object[locale] != 'undefined' ? object[locale] : '';
    },
});
