import { useNextScroll } from 'plugins/next-scroll';
import React, { useEffect, useState } from 'react';

export const getRelativeOffset = (scroll, target, withTarget) => {
    var rectTarget = target.getBoundingClientRect();
    var reactWithTarget =
        withTarget == window
            ? {
                  x: 0,
                  y: 0,
                  width: window.innerWidth,
                  height: window.innerHeight,
                  left: 0,
                  right: window.innerWidth,
                  top: 0,
                  bottom: window.innerHeight,
              }
            : withTarget.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    // var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    // var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var scrollLeft = scroll.x;
    var scrollTop = scroll.y;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var targetY = rectTarget.top + scrollTop - clientTop;
    var targetX = rectTarget.left + scrollLeft - clientLeft;

    var withTargetY = reactWithTarget.top + scrollTop - clientTop;
    var withTargetX = reactWithTarget.left + scrollLeft - clientLeft;

    return { x: targetX - withTargetX, y: targetY - withTargetY };
};

/**
 * @param  {RefObject} target - The target element ref you want to get relative offset position.
 * @param  {RefObject} withTarget - The relative element which you want to calculate from.
 */
const useNextOffset = (target, withTarget) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [_target, setTarget] = useState(typeof target != 'undefined' ? target.current : undefined);
    const [_withTarget, setWithTarget] = useState(
        typeof window == 'undefined'
            ? undefined
            : withTarget == window
            ? withTarget
            : typeof withTarget != 'undefined'
            ? withTarget.current
            : undefined
    );

    const scroll = useNextScroll(withTarget);

    useEffect(() => {
        // ("_target", _target);
        if (typeof withTarget == 'undefined') {
            setWithTarget(window);
        } else {
            setWithTarget(withTarget.current);
        }

        if (typeof target != 'undefined') setTarget(target.current);
    }, [target, withTarget]);

    useEffect(() => {
        // ("scroll", scroll);
        if (_target && _withTarget) {
            // calculating offset
            const offset = getRelativeOffset(scroll, _target, _withTarget);
            setOffset(offset);
        }
    }, [_target, _withTarget, scroll.x, scroll.y]);

    // useEffect(() => {
    //   const handler = () => {
    //     if (_withTarget) {
    //       const newPos = {
    //         x: _withTarget == window ? _withTarget.scrollX : _withTarget.scrollLeft,
    //         y: _withTarget == window ? _withTarget.scrollY : _withTarget.scrollTop,
    //       };
    //       setPos(newPos);
    //       if (onChange) onChange(newPos);
    //     }
    //   };

    //   if (_withTarget) {
    //     _withTarget.addEventListener("scroll", handler, {
    //       capture: false,
    //       passive: true,
    //     });
    //     handler();
    //   }

    //   return () => {
    //     if (_withTarget) {
    //       _withTarget.removeEventListener("scroll", handler);
    //     }
    //   };
    // }, [_target, _withTarget])

    return offset;
};

export default useNextOffset;
