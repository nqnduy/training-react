import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChildTest1 from './ChildTest1';

const ParentTest1 = (props) => {
    // const [count, setCount] = useState(0);

    return (
        <>
            {/* <button
                className="bg-red-500 p-3"
                onClick={(first) => {
                    setCount(count + 1);
                }}
            >
                change index child - Index: {count}
            </button> */}

            <ChildTest1
                // index={count}
                {...props}
            />
        </>
    );
};
ParentTest1.propTypes = {};

export default ParentTest1;
