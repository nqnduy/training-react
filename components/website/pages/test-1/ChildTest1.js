import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

const ChildTest1 = ({ index = 0, ...props }) => {
    const [stylesMain, setStylesMain] = useSpring(() => ({
        // config: { ... }
        loop: { reverse: true },
        from: { opacity: 1, x: 0 },
        to: { opacity: 1, x: 500 },
    }));

    return (
        <>
            <animated.div style={stylesMain} className="holder">
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

ChildTest1.propTypes = {};

export default ChildTest1;
