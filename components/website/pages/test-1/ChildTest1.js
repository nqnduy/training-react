import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';
import CardDetail from '@/components/website/pages/CardDetail';

const ChildTest1 = ({ data = [], ...props }) => {
    const [stylesMain, setStylesMain] = useSpring(() => ({
        // config: { ... }
        // loop: { reverse: true },
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 },
    }));
    return (
        <>
            <animated.div style={stylesMain} className="holder overflow-hidden">
                {console.log('render ChildTest1:>> ', data)}

                {data.map((item, index) => {
                    return <CardDetail data={item} key={index} />;
                })}
            </animated.div>
        </>
    );
};

ChildTest1.propTypes = {};

export default ChildTest1