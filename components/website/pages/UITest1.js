import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ParentTest1 from './test-1/ParentTest1';
import { Button } from 'antd';

const UITest1 = ({ ...props }) => {
    const [count, setCount] = useState(0);

    return (
        <>
            <Button
                onClick={(first) => {
                    setCount(count + 1);
                }}
            >
                change state - Count: {count}
            </Button>

            <ParentTest1 />
        </>
    );
};

UITest1.propTypes = {};

export default UITest1;
