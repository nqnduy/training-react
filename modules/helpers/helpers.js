import { notification } from 'antd';
import { message } from 'antd';
import { isArray, isObject } from 'util';
import { locales } from '@/constants/locale';

var self = (module.exports = {
    showSuccess: function (res) {
        if (res.status == true && Array.isArray(res.message)) {
            res.message.map((msg) => {
                notification.success({
                    message: msg,
                });
            });
        } else if (res.status == true && res.message) {
            notification.success({
                message: res.message,
            });
        } else {
            notification.success({
                message: 'Success',
            });
        }
    },

    showError: function (res) {
        if (res.status == false && Array.isArray(res.message)) {
            res.message.map((msg) => {
                notification.error({
                    message: msg,
                });
            });
        } else if (res.status == false && res.message) {
            notification.error({
                message: res.message,
            });
        } else {
            notification.error({
                message: 'Something wrong!',
            });
        }
    },

    showMessages: function (msgs, isError = true) {
        if (isError) {
            msgs.forEach(function (msg) {
                message.error(msg);
            });
        } else {
            msgs.forEach(function (msg) {
                message.success(msg);
            });
        }
    },

    showNotifications: function (messages, isError = true) {
        if (isError) {
            messages.forEach(function (message) {
                notification.error({
                    message,
                });
            });
        } else {
            messages.forEach(function (message) {
                notification.success({
                    message,
                });
            });
        }
    },

    getBase64: function (img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    },

    getFileNameFromPath: function (path) {
        if (path == null) {
            return path;
        }
        let ext = path.substring(path.lastIndexOf('.'));
        let originalName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf(ext));
        originalName = originalName.substring(0, path.lastIndexOf('_') != -1 ? path.lastIndexOf('_') : path.lastIndexOf('.'));
        return `${originalName}${ext}`;
    },

    isFile: function (object) {
        if (object && typeof object.type != 'undefined' && typeof object.size != 'undefined') {
            return true;
        } else {
            return false;
        }
    },

    isFileByStr: function (fileName) {
        fileName = `${fileName}`;
        return fileName.match(/\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|ppt|pptx|csv)$/);
    },

    pad(number, width = 1, needle) {
        needle = needle || '0';
        number = number + '';
        return number.length >= width ? number : new Array(width - number.length + 1).join(needle) + number;
    },

    checkPermission: function (user, permission) {
        if (typeof window !== 'undefined') {
            // Perform localStorage action
            user['userPermission']['permissions'] =
                window.localStorage.getItem('permissions') != 'undefined' ? JSON.parse(window.localStorage.getItem('permissions')) : {};
        }
        if (!user) {
            return false;
        }
        let userPermission = user.userPermission;
        let isAdmin = userPermission.isAdmin;

        if (isAdmin) return true;

        let hasPermission;
        if (isArray(permission) && permission.length > 0) {
            for (let per of permission) {
                hasPermission = (userPermission.permissions[per] || 0) == 1;
                if (hasPermission) break;
            }
        } else {
            hasPermission = (userPermission.permissions[permission] || 0) == 1;
        }

        if (!isAdmin && !hasPermission) {
            return false;
        } else {
            return true;
        }
    },

    strToSlug: function (str) {
        str = str.toLowerCase();
        let slug = self.removeSignVietnamese(str);
        slug = slug.replace(/[^\w-]+/g, '-');
        slug = slug.replace(/\-$/g, '');
        slug = slug.replace(/^\-/g, '');
        slug = slug.replace(/\ +/g, '-');
        slug = slug.toLowerCase();
        return slug;
    },

    removeSignVietnamese(str = '') {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
        return str;
    },

    forEachAny: function (data, cb) {
        if (isArray(data) && data) {
            data.forEach(function (ele, index) {
                cb(ele, index);
            });
        } else if (isObject(data) && data) {
            Object.keys(data).forEach(function (index) {
                cb(data[index], index);
            });
        }
    },

    postGetForm: function (formInput, images) {
        images = images || [];
        if (!images.length) return formInput;
        images.forEach(function (image) {
            let isSingleLocale = ['undefined', 'object'].indexOf(typeof formInput[image]) == -1 && formInput[image];
            if (isSingleLocale) {
                formInput[`${image}Url`] = formInput[image];
                formInput[image] = self.getFileNameFromPath(formInput[image]);
            }
        });
        //
        if (!Object.keys(locales).length) return formInput;
        Object.keys(locales).forEach(function (locale) {
            images.forEach(function (image) {
                let isMultiLocale = typeof formInput[image] != 'undefined' && formInput[image] && typeof formInput[image][locale] != 'undefined';
                if (isMultiLocale) {
                    formInput[`${image}${locale}Url`] = formInput[image][locale];
                    formInput[`${image}${locale}`] = self.getFileNameFromPath(formInput[image][locale]);
                }
            });
        });
        return formInput;
    },

    preSaveForm: function (formInput, currentFormInput, images) {
        images = images || [];
        if (!images.length) return currentFormInput;
        // single locale
        images.forEach(function (image) {
            if (typeof formInput[image] != 'undefined' && self.isFile(formInput[image])) {
                currentFormInput[image] = formInput[image];
            } else if (!currentFormInput[image] && formInput[image] == '') {
                currentFormInput[image] = null;
            }
        });
        // multi locale
        if (!Object.keys(locales).length) return currentFormInput;
        Object.keys(locales).forEach(function (locale) {
            images.forEach(function (image) {
                if (typeof formInput[`${image}${locale}`] != 'undefined' && self.isFile(formInput[`${image}${locale}`])) {
                    currentFormInput[image][locale] = formInput[`${image}${locale}`];
                } else if (
                    typeof currentFormInput[image] != 'undefined' &&
                    currentFormInput[image] &&
                    typeof currentFormInput[image][locale] != 'undefined'
                ) {
                    currentFormInput[image][locale] = self.getFileNameFromPath(formInput[`${image}${locale}`] || '');
                }
            });
        });
        return formInput;
    },

    postGetFormMultiUpload: function (formInput, images, gallery) {
        images = images || [];
        gallery = gallery || [];
        //
        if (gallery.length) {
            gallery.forEach(function (name) {
                let formInputGallery = formInput[name] || [];
                let currentGallery = [];
                if (!formInputGallery.length) return;
                formInputGallery.forEach(function (url, uid) {
                    currentGallery.push({
                        uid: uid,
                        name: self.getFileNameFromPath(url),
                        status: 'done',
                        url: url,
                    });
                });
                formInput[name] = currentGallery;
            });
        }
        //
        if (!images.length) return formInput;
        images.forEach(function (image) {
            let isSingleLocale = ['undefined', 'object'].indexOf(typeof formInput[image]) == -1 && formInput[image];
            if (isSingleLocale) {
                formInput[`${image}Url`] = formInput[image];
                formInput[image] = self.getFileNameFromPath(formInput[image]);
            }
        });
        //
        if (!Object.keys(locales).length) return formInput;
        Object.keys(locales).forEach(function (locale) {
            images.forEach(function (image) {
                let isMultiLocale = typeof formInput[image] != 'undefined' && formInput[image] && typeof formInput[image][locale] != 'undefined';
                if (isMultiLocale) {
                    formInput[`${image}${locale}Url`] = formInput[image][locale];
                    formInput[`${image}${locale}`] = self.getFileNameFromPath(formInput[image][locale]);
                }
            });
        });
        return formInput;
    },

    preSaveFormMultiUpload: function (formInput, currentFormInput, images, gallery) {
        images = images || [];
        gallery = gallery || [];
        //
        if (gallery.length) {
            gallery.forEach(function (name) {
                let formInputGallery = formInput[name] || [];
                let currentGallery = [];
                if (!formInputGallery.length) return;
                formInputGallery.forEach(function (file) {
                    let photo = self.isFile(file) ? file.originFileObj : file.name;
                    currentGallery.push(photo);
                });
                currentFormInput[name] = currentGallery;
            });
        }
        //
        if (!images.length) return currentFormInput;
        // single locale
        images.forEach(function (image) {
            if (typeof formInput[image] != 'undefined' && self.isFile(formInput[image])) {
                currentFormInput[image] = formInput[image];
            } else if (!currentFormInput[image] && formInput[image] == '') {
                currentFormInput[image] = null;
            }
        });
        // multi locale
        if (!Object.keys(locales).length) return currentFormInput;
        Object.keys(locales).forEach(function (locale) {
            images.forEach(function (image) {
                if (typeof formInput[`${image}${locale}`] != 'undefined' && self.isFile(formInput[`${image}${locale}`])) {
                    currentFormInput[image][locale] = formInput[`${image}${locale}`];
                } else if (
                    typeof currentFormInput[image] != 'undefined' &&
                    currentFormInput[image] &&
                    typeof currentFormInput[image][locale] != 'undefined'
                ) {
                    currentFormInput[image][locale] = self.getFileNameFromPath(formInput[`${image}${locale}`] || '');
                }
            });
        });
        return formInput;
    },

    trackingFormUrl: function (form, content, previousKey) {
        self.forEachAny(content, function (ele, index) {
            let key = index;
            if (previousKey) {
                key = `${previousKey}[${key}]`;
            }
            if (!ele || self.isFile(ele)) {
                form[key] = ele;
            } else if (isArray(ele) && ele.length == 0) {
                form[`${key}[]`] = '';
            } else if (isObject(ele) && Object.keys(ele).length == 0) {
                form[`${key}`] = {};
            } else if (isArray(ele) || isObject(ele)) {
                self.trackingFormUrl(form, ele, key);
            } else {
                form[key] = ele;
            }
        });
    },

    trackingFormData: function (form, content, previousKey) {
        self.forEachAny(content, function (ele, index) {
            let key = index;
            if (previousKey) {
                key = `${previousKey}[${key}]`;
            }

            if (!ele || self.isFile(ele)) {
                form.append(key, ele);
            } else if (isArray(ele) && ele.length == 0) {
                form.append(`${key}[]`, '');
            } else if (isArray(ele) || isObject(ele)) {
                self.trackingFormData(form, ele, key);
            } else {
                form.append(key, ele);
            }
        });
    },

    trackingContentRef: function (contentRef, previousKey, sort = [], contentImgs = [], contentRmImgs = [], field = 'content') {
        let content = [];
        let sortedContent = [];
        self.forEachAny(contentRef, function (current, index) {
            let key = index;
            if (previousKey) {
                key = `${previousKey}[${key}]`;
            }
            // check is ref content
            let isContentValue = key.substr(0, field.length) == field ? true : false;
            if (isContentValue && current) {
                let imgFields = ['image', 'banner'];
                let value = current.value ? current.value : '';
                if (value.value) {
                    value = value.value;
                }
                if (current.editor) {
                    value = current.editor.getData();
                }

                // get rest key of content as [0][section] | [0][title]
                let restKey = key.substr(field.length);
                let sectionPosition = restKey.substr(1, restKey.indexOf(']') - 1); // only number
                //
                let topNamePosition = restKey.substr(restKey.indexOf(']') + 2);
                topNamePosition = topNamePosition.substr(0, topNamePosition.indexOf(']'));
                //
                let secondPosition = restKey.substr(restKey.indexOf(topNamePosition) + topNamePosition.length + 2);
                secondPosition = secondPosition.substr(0, secondPosition.indexOf(']'));

                let secondNamePosition = restKey.substr(restKey.lastIndexOf('[') + 1);
                secondNamePosition = secondNamePosition.substr(0, secondNamePosition.indexOf(']'));

                if (!content[sectionPosition]) {
                    content[sectionPosition] = {};
                }

                if (
                    !contentImgs[value] &&
                    contentRmImgs.includes(value) &&
                    (secondNamePosition.includes('image') || secondNamePosition.includes('banner'))
                ) {
                    value = '';
                } else if (
                    !contentImgs[value] &&
                    !self.isFileByStr(value) &&
                    (secondNamePosition.includes('image') || secondNamePosition.includes('banner'))
                ) {
                    value = '';
                }

                if (
                    !contentImgs[value] &&
                    contentRmImgs.includes(value) &&
                    (topNamePosition.includes('image') || topNamePosition.includes('banner'))
                ) {
                    value = '';
                } else if (
                    !contentImgs[value] &&
                    !self.isFileByStr(value) &&
                    (topNamePosition.includes('image') || topNamePosition.includes('banner'))
                ) {
                    value = '';
                }

                if (secondPosition && !isNaN(secondPosition) && secondNamePosition && typeof secondNamePosition == 'string') {
                    content[sectionPosition][topNamePosition] = content[sectionPosition][topNamePosition] || [];
                    content[sectionPosition][topNamePosition][secondPosition] = content[sectionPosition][topNamePosition][secondPosition] || {};
                    content[sectionPosition][topNamePosition][secondPosition][secondNamePosition] = value;
                } else if (secondPosition && !isNaN(secondPosition)) {
                    content[sectionPosition][topNamePosition] = content[sectionPosition][topNamePosition] || [];
                    content[sectionPosition][topNamePosition][secondPosition] = value;
                } else {
                    content[sectionPosition][topNamePosition] = value;
                }
            }
        });

        sort.forEach(function (order) {
            if (content[order]) {
                sortedContent.push(content[order]);
            }
        });

        return sortedContent;
    },
});
