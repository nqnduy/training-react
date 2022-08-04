import { findKey } from 'lodash';
import Swal from 'sweetalert2';

const BROWSER = {
    messenger: /\bFB[\w_]+\/(Messenger|MESSENGER)/,
    facebook: /\bFB[\w_]+\//,
    twitter: /\bTwitter/i,
    line: /\bLine\//i,
    wechat: /\bMicroMessenger\//i,
    puffin: /\bPuffin/i,
    miui: /\bMiuiBrowser\//i,
    instagram: /\bInstagram/i,
    chrome: /\bCrMo\b|CriOS|Android.*Chrome\/[.0-9]* (Mobile)?/,
    safari: /Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari/,
    ie: /IEMobile|MSIEMobile/,
    firefox: /fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS/,
};

let isInit = false;
let _listeners = [];
export class BrowserEvent {
    static get CHANGED() {
        return 'changed';
    }
    static get VIEW_MODE_CHANGED() {
        return 'view_mode_changed';
    }
    static get ORIENTATION_CHANGED() {
        return 'orientation_changed';
    }
}

const Browser = {
    get ua() {
        return navigator.userAgent || navigator.vendor || window.opera;
    },

    get browser() {
        return findKey(BROWSER, (regex) => regex.test(this.ua)) || 'other';
    },

    get isMobile() {
        return /(iPhone|Mobile|Android)/i.test(this.ua) || false;
    },

    get isTablet() {
        return !this.isMobile && !this.isDesktop;
    },

    get isMobileAndTablet() {
        return this.isMobile && this.isTablet;
    },

    get isTouchDevice() {
        return this.isMobileAndTablet;
    },

    get isDesktop() {
        return typeof window != 'undefined' && !('ontouchstart' in window);
    },

    get isFacebookWebview() {
        var ua = this.ua;
        return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
    },

    get isInAppWebview() {
        const rules = ['WebView', '(iPhone|iPod|iPad)(?!.*Safari/)', 'Android.*(wv|.0.0.0)'];
        const regex = new RegExp(`(${rules.join('|')})`, 'ig');
        return Boolean(this.ua.match(regex));
    },

    orientation: 'potrait',
    viewMode: 'normal',
    device: 'desktop',
    init: (autoFixFullscreen = true) => {
        isInit = true;
        var isLandscape = false;
        var isFullscreen = false;
        var scope = Browser;

        onResize();

        window.addEventListener('resize', onResize);
        // window.addEventListener('touchstart', onTouchMove)
        window.addEventListener('touchmove', onTouchMove, { passive: false });

        function onTouchMove(e) {
            if (e.changedTouches.length > 1) {
                e.preventDefault();
            }
        }

        function onResize(e) {
            setTimeout(() => {
                var _isLandscape = window.matchMedia('(orientation: landscape)').matches;
                var _isFullscreen = window.innerHeight >= window.outerHeight - 64;

                // (window.outerHeight, window.innerHeight, window.screen.height)
                // (window.outerWidth, window.innerWidth, window.screen.width)

                // setCurrentOrientation(isLandscape ? "landscape" : "potrait")
                // setCurrentView(isFullscreen ? "fullscreen" : "normal")

                // var scope = Browser;
                // (scope)
                scope.orientation = _isLandscape ? 'landscape' : 'potrait';
                scope.viewMode = _isFullscreen ? 'fullscreen' : 'normal';
                // ('window.orientation:', window.orientation)

                if (scope.isDesktop) {
                    scope.device = 'desktop';
                } else if (scope.isTablet) {
                    scope.device = 'tablet';
                } else {
                    scope.device = 'mobile';
                }

                if (_isFullscreen != isFullscreen) {
                    scope.dispatchEvent(BrowserEvent.VIEW_MODE_CHANGED);
                    isFullscreen = _isFullscreen;
                }

                if (_isLandscape != isLandscape) {
                    scope.dispatchEvent(BrowserEvent.ORIENTATION_CHANGED);
                    isLandscape = _isLandscape;
                }

                scope.dispatchEvent(BrowserEvent.CHANGED);

                if (autoFixFullscreen) {
                    if (!isLandscape) {
                        // POTRAIT
                        // window.document.body.style.height = "10000px"
                        // window.document.body.style.overflow = "auto";
                        window.document.body.style.height = '100%';
                        window.document.body.style.overflow = 'hidden';
                    } else {
                        // LANDSCAPE
                        if (isFullscreen) {
                            if (scope.isMobile) {
                                window.document.body.style.height = '100%';
                                window.document.body.style.overflow = 'hidden';
                            }
                        } else {
                            window.document.body.style.height = '10000px';
                            window.document.body.style.overflow = 'auto';
                        }
                    }
                }
            }, 50);
        }
    },

    addEventListener: (event, cb) => {
        if (!isInit) {
            console.warn("You need to call 'Browser.init()' first.");
            return;
        }

        switch (event) {
            case BrowserEvent.CHANGED:
                _listeners.push({ event: event, listener: cb });
                break;
            case BrowserEvent.CHANGED:
                _listeners.push({ event: event, listener: cb });
                break;
            default:
                console.warn(`No event "${event}" found`);
                break;
        }
    },

    dispatchEvent: (event) => {
        var scope = Browser;
        var response = {
            event: event,
            orientation: scope.orientation,
            viewMode: scope.viewMode,
            device: scope.device,
        };
        _listeners.forEach((dispatcher) => {
            if (dispatcher.event == event) {
                if (dispatcher.listener) dispatcher.listener(response);
            }
        });
    },

    get isSupportWebGL() {
        // return Detector.webgl();
        var Detector = {
            canvas: window && !!window.CanvasRenderingContext2D,
            webgl: (function () {
                try {
                    var canvas = document.createElement('canvas');
                    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
                } catch (e) {
                    return false;
                }
            })(),
            workers: !!window.Worker,
            fileapi: window.File && window.FileReader && window.FileList && window.Blob,

            getWebGLErrorMessage: function () {
                var element = document.createElement('div');
                element.id = 'webgl-error-message';
                element.style.fontFamily = 'monospace';
                element.style.fontSize = '13px';
                element.style.fontWeight = 'normal';
                element.style.textAlign = 'center';
                element.style.background = '#fff';
                element.style.color = '#000';
                element.style.padding = '1.5em';
                element.style.width = '400px';
                element.style.margin = '5em auto 0';

                if (!this.webgl) {
                    element.innerHTML = window.WebGLRenderingContext
                        ? [
                              'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                              'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.',
                          ].join('\n')
                        : [
                              'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                              'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.',
                          ].join('\n');
                }

                return element;
            },

            addGetWebGLMessage: function (parameters) {
                var parent, id, element;

                parameters = parameters || {};

                parent = parameters.parent !== undefined ? parameters.parent : document.body;
                id = parameters.id !== undefined ? parameters.id : 'oldie';

                element = Detector.getWebGLErrorMessage();
                element.id = id;

                parent.appendChild(element);
            },
        };

        return Detector.webgl;
    },

    requestUsingSafariIOS(options) {
        var _this = this;
        _this.ftpBridgeToSafari = 'ftp://159.65.130.187/bridge.html';
        _this.minChrome = '<b>Chrome</b>';
        _this.minFirefox = '<b>Firefox</b>';
        _this.minOpera = '<b>Opera</b>';
        _this.brands = '<b>Samsung</b>';
        _this.veTrangChu = 'Về <b>Trang chủ</b>!';
        _this.skip = '<b>Bỏ qua!</b>!';
        _this.direct_link = location.host + location.pathname + '?redirect_src=inappwebview';

        if (typeof gaTrackingClick != 'undefined') gaTrackingClick('tee_device', 'not_support_get_camera');
        if (typeof gaTrackingClick != 'undefined') gaTrackingClick('tee_browser', 'no_support_webRTC');

        options = typeof options != 'undefined' ? options : {};

        var onCancelCallback = options.hasOwnProperty('onCancelCallback') ? options['onCancelCallback'] : null;

        Swal.fire({
            html: '<b>Rất tiếc, trình duyệt trên chương trình này chưa hỗ trợ.</b> Vui lòng sử dụng Safari để có trải nghiệm tốt nhất!',
            type: 'warning',
            allowOutsideClick: false,
            confirmButtonText: '<a href="#" style="color: white;"">Mở Safari!</a> ',
            showCancelButton: true,
            cancelButtonText: '<a href="#" style="color: white;"">' + _this.skip + '</a> ',
        }).then(function (result) {
            if (result.value) {
                // if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'tai-lai-trang');
                // if (typeof trackingClickGA != "undefined") trackingClickGA('ChangeBrowser', 'ChangeBrowser');

                // var _browser = window.deviceInfo.browser.toLowerCase();
                // if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "safari");

                window.open(_this.ftpBridgeToSafari + '?url=' + location.href);
                // window.open(_this.ftpBridgeToSafari + "?url=" + location.href);
            } else {
                // if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_redirect_from_other_browser', 'cancel');
                // if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');

                Swal.close();
                if (onCancelCallback != null) onCancelCallback();
                // window.open(basePath, "_self");
            }
        });
    },
};

export default Browser;
