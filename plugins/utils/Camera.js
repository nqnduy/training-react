import gsap from 'gsap';

// check for device orientation support
var DEVICE_ORIENTATION = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
};
var deviceOrientation = DEVICE_ORIENTATION.VERTICAL;

var video;

/**
 * @type {AppWebcam}
 */
var webcam;
var isWebcamSupport = false;

// var onSetupComplete;

function requestWebcam({ container, onRejected, onReady }) {
    // options = options || {};

    var video = document.createElement('video');
    video.style.position = 'absolute';
    video.style.top = 0;
    video.style.left = 0;
    video.style.width = '100%';
    video.style.height = '100%';
    container.append(video);

    gsap.set(video, { opacity: 1 });

    // $(video).css("z-index", "-2");
    // $(video).css("position", "absolute");
    // $(video).css("top", "0px");
    // $(video).css("left", "0px");

    stopWebcam();

    webcam = new AppWebcam(video);
    webcam.onReady = function (e) {
        setupApp();

        isWebcamSupport = true;

        if (onReady) onReady(e);
    };

    webcam.onRejected = function (e) {
        setupApp();

        isWebcamSupport = false;

        // if (typeof gaTrackingClick != "undefined") gaTrackingClick('request_permission', 'reject_camera');

        if (onRejected) onRejected(e);
    };

    return webcam;
}

function setupApp() {
    var _isAllow = false;

    if (typeof webcam != 'undefined') {
        if (webcam.isAllowed) {
            gsap.to(video, { duration: 2, opacity: 1 });
            _isAllow = true;
        }
    }
}

function stopWebcam() {
    if (webcam) webcam.remove();
}

/**
 * @param  {HTMLVideoElement} videoElement
 */
function AppWebcam(videoElement) {
    // define scope
    var scope = this;

    // private vars
    /**
     * @type {MediaDeviceInfo[]}
     */
    var inputCameras = [];

    /**
     * @type {MediaStreamConstraints}
     */
    var requestedMediaConstraints = {
        video: {
            // width: 640,
            // height: 480,
            facingMode: { exact: 'environment' },
            // facingMode: 'environment'
        },
        audio: false,
    };

    /**
     * @type {MediaStream}
     */
    var stream;
    var isAllowed = false;
    /**
     * @type {HTMLVideoElement}
     */
    var video;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'AppWebcam' + new Date().getTime());

    // var requestWidth = deviceOrientation == DEVICE_ORIENTATION.VERTICAL
    //   ? 360
    //   : 640;
    // var requestHeight = deviceOrientation == DEVICE_ORIENTATION.VERTICAL
    //   ? 640
    //   : 360;

    this.currentCamera = null;

    // initialise
    init();

    // constructor
    function init() {
        if (!videoElement) {
            video = document.createElement('video');
        } else {
            video = videoElement;
        }
        //alert("!");

        // canvasElement = document.getElementById ('canvas');
        // canvasElement.width = window.innerWidth - 50;
        // canvasElement.height = canvasElement.width;
        // canvas = canvasElement.getContext ('2d');
        // loadingMessage = document.getElementById ('loadingMessage');

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                // First get ahold of the legacy getUserMedia, if present
                var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }

        // start requesting media permissions:

        console.log('[Camera.js] Requesting:', requestedMediaConstraints);

        if (navigator.mediaDevices.enumerateDevices === undefined) {
            setTimeout(function () {
                handleError({ name: 'Error', message: 'NotSupported' });
            }, 50);
        } else {
            navigator.mediaDevices.enumerateDevices().then(parseDevices).catch(handleError);
        }

        // navigator.mediaDevices.getUserMedia(requestedMediaConstraints).then(() => {
        //   if (typeof navigator.mediaDevices.enumerateDevices == "undefined") {
        //     setTimeout(function () {
        //       handleError({ name: 'Error', message: 'NotSupported' });
        //     }, 50);
        //   } else {
        //     navigator.mediaDevices
        //       .enumerateDevices()
        //       .then(parseDevices)
        //       .catch(handleError);
        //   }
        // }).catch(handleError);
    }

    /**
     * @param  {MediaDeviceInfo[]} devices
     */
    function parseDevices(devices) {
        inputCameras = [];
        var backCameras = [];

        devices.forEach(function (device) {
            if (device.kind == 'videoinput' && typeof device.deviceId != 'undefined' && device.deviceId != '') {
                inputCameras.push(device);
            }
        });
        // //alert (JSON.stringify (devices));
        console.log('[Camera.js] inputCameras:', inputCameras);

        if (inputCameras.length > 0) {
            var cams = '';
            var backCamera;

            inputCameras.map((cam, index) => {
                cams += `[${cam.deviceId}] ${cam.kind} | ${cam.label}\n`;
                // (cam);
                var label = cam.label.toLowerCase();
                if (label.indexOf('back') > -1 || label.indexOf('facetime') > -1) {
                    backCamera = cam;
                    backCameras.push(backCamera);
                }
            });

            if (backCameras.length > 1) {
                backCamera = backCameras[backCameras.length - 1];
            }

            console.log(`[Camera.js] All input sources:`, cams);
            console.log(`[Camera.js] This device has ${backCameras.length} back camera${backCameras.length > 1 ? 's' : ''}.`);
            console.log('[Camera.js] backCameras:', JSON.stringify(backCameras));

            scope.currentCamera = backCamera;

            if (scope.onGotDevices) {
                scope.onGotDevices(devices);
            }

            // Lấy stream của camera sau
            // (Lấy cái cuối cùng trong danh sách trước, thường sẽ là camera chính trên Android)
            getStreamOfCameraId(backCamera.deviceId)
                .then(onStreamReceived)
                .catch((e) => {
                    if (backCameras.length > 1) {
                        // nếu thiết bị có nhiều hơn 1 camera sau -> thử lấy camera khác
                        backCamera = backCameras[backCameras.length - 2];
                        getStreamOfCameraId(backCamera.deviceId).then(onStreamReceived).catch(handleError);
                    } else if (backCameras.length > 2) {
                        // nếu thiết bị có nhiều hơn 2 camera sau -> thử lấy camera khác nữa
                        backCamera = backCameras[backCameras.length - 3];
                        getStreamOfCameraId(backCamera.deviceId).then(onStreamReceived).catch(handleError);
                    } else {
                        // nếu thiết bị đéo có camera sau...
                        handleError(e);
                    }
                });
        } else {
            navigator.mediaDevices.getUserMedia(requestedMediaConstraints).then(onStreamReceived).catch(handleError);

            if (scope.onGotDevicesFailed) scope.onGotDevicesFailed();
        }
    }

    function getStreamOfCameraId(id) {
        var constraints = {
            video: { deviceId: { exact: id } },
            audio: false,
        };

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject);
        });
    }

    /**
     * @param  {MediaStream} stream
     */
    function onStreamReceived(stream) {
        if (inputCameras.length == 0) {
            console.log('[Camera.js] Not found any back cameras, request again?');
            navigator.mediaDevices.enumerateDevices().then(parseDevices).catch(handleError);
            return;
        }

        isAllowed = true;

        playWebcamVideo(stream);
    }

    /**
     * @param  {MediaStream} _stream
     */
    function playWebcamVideo(_stream) {
        stream = _stream;

        if ('srcObject' in video) {
            // //alert ('GOT STREAM VIDEO OBJECT');
            video.srcObject = _stream;
        } else {
            // //alert ('GOT STREAM VIDEO SOURCE URL');
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(_stream);
        }

        // required to tell iOS safari we don't want fullscreen
        video.setAttribute('playsinline', true);
        video.setAttribute('muted', true);
        video.setAttribute('autoplay', true);
        video.muted = true;
        video.autoplay = true;
        video.style.objectFit = 'cover';
        video.play();

        // auto play
        video.addEventListener('canplay', function (e) {
            // //alert ('CAN PLAY');
        });

        video.addEventListener('canplaythrough', function (e) {
            // //alert ('CAN PLAY THROUGH');
        });

        video.addEventListener('error', (e) => console.log('[Camera.js] <video> error:', e));

        video.addEventListener('stalled', function (e) {
            // //alert ('CANNOT GET METADATA');
            isAllowed = false;
            console.log('[Camera.js] <video> stalled:', e);
            if (scope.onRejected != null) scope.onRejected(e);
        });

        video.addEventListener('loadedmetadata', function (e) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas.style.width = window.outerWidth + 'px';
            canvas.style.height = window.outerHeight + 'px';

            if (scope.currentCamera.label.toLowerCase().indexOf('facetime') > -1) {
                video.style.transform = 'scaleX(-1)';
                video.style.webkitTransform = 'scaleX(-1)';
            }

            video.play();

            if (scope.onReady) scope.onReady(video);
        });
    }

    function handleError(err) {
        console.error(err);
        var errMsg = '[Camera.js] ' + err.name + ': ' + err.message;
        console.error(errMsg);

        isAllowed = false;

        if (scope.onRejected != null) scope.onRejected(err);
    }

    function drawVideo() {
        var ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    }

    function captureAsBase64(callback) {
        console.log(`[Camera.js] Base64 captured -> ${video.videoWidth}x${video.videoHeight}`);

        drawVideo();

        TweenMax.delayedCall(0.2, function () {
            var screenshot = canvas.toDataURL('image/png');
            if (callback) callback(screenshot);
        });
    }

    function captureAsImageData() {
        drawVideo();

        var ctx = canvas.getContext('2d');
        return ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    }

    function dispose() {}

    function enable() {}

    function disable() {}

    function remove() {
        if (stream) stream.getTracks().forEach((track) => track.stop());
    }

    // exports
    this.enable = enable;
    this.disable = disable;
    this.video = video;
    this.inputCameras = inputCameras;
    this.canvas = canvas;
    this.captureAsBase64 = captureAsBase64;
    this.captureAsImageData = captureAsImageData;
    this.onReady = null;
    this.onRejected = null;
    this.onGotDevices = null;
    this.onGotDevicesFailed = null;
    this.init = init;
    this.remove = remove;
    this.stream = stream;
}

export { video, webcam, isWebcamSupport, requestWebcam, stopWebcam };
