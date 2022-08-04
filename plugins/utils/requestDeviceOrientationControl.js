import DeviceHelper from 'plugins/utils/DeviceHelper';

const requestDeviceOrientationControl = (params) => {
    if (typeof window == 'undefined') return;
    return new Promise((resolve, reject) => {
        if (DeviceHelper.isAndroid) resolve(true);

        if (typeof DeviceMotionEvent != 'undefined' && DeviceMotionEvent.requestPermission) {
            // (optional) Do something before API request prompt.
            DeviceOrientationEvent.requestPermission()
                .then((response) => {
                    // (optional) Do something after API prompt dismissed.
                    if (response == 'granted') {
                        resolve(true);
                        // resolve({ status: true })
                    } else {
                        resolve(false);
                        // resolve({ status: false, reason: "DeviceMotionEvent is not support" })
                    }
                })
                .catch((response) => {
                    resolve(false);
                    // resolve({ status: false, reason: response })
                });
        } else {
            resolve(false);
            // resolve({ status: false, reason: "DeviceMotionEvent is not defined" })
        }
    });
};

export default requestDeviceOrientationControl;
