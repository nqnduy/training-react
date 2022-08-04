// import { usePrevious } from "ahooks";
import useNextOffset from 'plugins/next-offset';
import React, { useEffect, useRef, useState } from 'react';
import { animated, Spring } from 'react-spring';

export const useNextScrollTrigger = (target, scrollTarget, { offsetLeft = 0, offsetRight = 0, offsetTop = 0, offsetBottom = 0 } = {}) => {
    // const { offsetLeft = 0, offsetRight = 0, offsetTop = 0, offsetBottom = 0 } = options;
    const [status, setStatus] = useState('leave');

    const [_target, setTarget] = useState(typeof target != 'undefined' ? target.current : undefined);
    const [_scrollTarget, setScrollTarget] = useState(
        typeof window == 'undefined'
            ? undefined
            : scrollTarget == window
            ? scrollTarget
            : typeof scrollTarget != 'undefined'
            ? scrollTarget.current
            : undefined
    );

    const relativePosition = useNextOffset(target, scrollTarget);
    // const previousPosition = usePrevious(relativePosition);

    useEffect(() => {
        // ("_target", _target);
        if (typeof scrollTarget == 'undefined') {
            setScrollTarget(window);
        } else {
            setScrollTarget(scrollTarget.current);
        }

        if (typeof target != 'undefined') setTarget(target.current);
    }, [target, scrollTarget]);

    useEffect(() => {
        if (_target && _scrollTarget) {
            let parentWidth = _scrollTarget == window ? _scrollTarget.innerWidth : _scrollTarget.clientWidth;
            let parentHeight = _scrollTarget == window ? _scrollTarget.innerHeight : _scrollTarget.clientHeight;

            if (
                relativePosition.x >= offsetLeft - _target.clientWidth &&
                relativePosition.x <= parentWidth - offsetRight &&
                relativePosition.y >= offsetTop - _target.clientHeight &&
                relativePosition.y <= parentHeight - offsetBottom
            ) {
                setStatus('enter');
            } else {
                setStatus('leave');
            }
        }
        // if(offset.x < scrollTarget.clientWidth)
    }, [_target, _scrollTarget, relativePosition.x, relativePosition.y, offsetLeft, offsetRight, offsetTop, offsetBottom]);

    return status;
};

export const NextScrollTrigger = ({
    children,
    scrollTarget,
    enterAnimation = {},
    leaveAnimation = {},
    offsetLeft = 0,
    offsetRight = 0,
    offsetTop = 0,
    offsetBottom = 0,
}) => {
    const itemRef = useRef();

    const [_scrollTarget, setScrollTarget] = useState(scrollTarget);

    const scrollTriggerStatus = useNextScrollTrigger(itemRef, _scrollTarget, {
        offsetLeft,
        offsetRight,
        offsetTop,
        offsetBottom,
    });

    const [animationValues, setAnimationValues] = useState(leaveAnimation);

    useEffect(() => {
        console.log('scrollTarget', scrollTarget);
        setScrollTarget(scrollTarget);
    }, [scrollTarget]);

    useEffect(() => {
        if (scrollTriggerStatus == 'enter') {
            setAnimationValues(enterAnimation);
        } else {
            setAnimationValues(leaveAnimation);
        }
    }, [scrollTriggerStatus]);

    return (
        <Spring to={animationValues}>
            {(props) => (
                <animated.div style={props} ref={itemRef}>
                    {children}
                </animated.div>
            )}
        </Spring>
    );
};
