import React, { useEffect } from 'react';

/**
 *
 * @param {Element} target DOM element or window | document , default is window
 * @param {Function} callback handle function
 * @param {String} eventName Event name
 */
const useEventListener = (eventName = 'load', callback, options) => {
    useEffect(() => {
        options = options || {};
        let target = options['target'] ? options.target : window || document;

        if (typeof target === 'string' && typeof document !== 'undefined') {
            target = document.querySelector(target);
        }

        if (!target) {
            // ("[useEventListener] target is not defined!");
            return;
        }
        // ("[useEventListener]", target);
        target.addEventListener(eventName, callback);

        return () => {
            target.removeEventListener(eventName, callback);
        };
    }, [eventName, callback]);
};

export default useEventListener;
