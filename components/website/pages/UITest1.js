import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ParentTest1 from './test-1/ParentTest1';

const UITest1 = (props) => {
    const [count, setCount] = useState(0);

    return (
        <>
            <button
                className="bg-blue-500 p-3"
                onClick={(first) => {
                    setCount(count + 1);
                }}
            >
                change state parent 1 - Count: {count}
            </button>

            <ParentTest1 />
        </>
    );
};

UITest1.propTypes = {};

export default UITest1;
