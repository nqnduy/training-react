import React, { useEffect, useState, RefObject } from 'react';

/**
 * @param  {RefObject} target -
 * @param  {Object} props -
 * @param  {void} props.onChange -
 */
export const useNextScroll = (target, props = {}) => {
    const { onChange } = props;
    // const [position, setPosition] = useState({ x: 0, y: 0 });
    const [_target, setTarget] = useState(
        typeof window == 'undefined' ? null : target == window ? target : typeof target != 'undefined' ? target.current : null
    );
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // listen for browser changed
        const handler = () => {
            if (_target) {
                const newPos = {
                    x: _target == window ? _target.scrollX : _target.scrollLeft,
                    y: _target == window ? _target.scrollY : _target.scrollTop,
                };
                setPos(newPos);
                if (onChange) onChange(newPos);
            }
        };

        if (_target) {
            _target.addEventListener('scroll', handler, {
                capture: false,
                passive: true,
            });
            handler();
        }

        return () => {
            if (_target) {
                _target.removeEventListener('scroll', handler);
            }
        };
    }, [_target]);

    useEffect(() => {
        // ("_target", _target);
        if (typeof target == 'undefined') {
            setTarget(window);
        } else {
            setTarget(target.current);
        }
    }, [target]);

    return pos;
};
