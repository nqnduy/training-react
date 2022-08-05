import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

const ChildTest2 = ({ index = 0, ...props }) => {
    const [stylesMain, setStylesMain] = useSpring(() => ({
        // config: { ... }
        // loop: { reverse: true },
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 },
    }));

    return (
        <>
            <animated.div style={stylesMain} {...props}>
                {Array.from(Array(100)).map((item, index) => {
                    console.log('render index', index);
                    return (
                        <span key={index} className="inline-block w-5 h-5">
                            {index}
                        </span>
                    );
                })}
            </animated.div>
        </>
    );
};

ChildTest2.propTypes = {};

export default ChildTest2;
