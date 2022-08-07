import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChildTest1 from './ChildTest1';
import MathExtra from '@/plugins/utils/MathExtra';

const ParentTest1 = (props) => {
    // const [count, setCount] = useState(0);

    const [data, setData] = useState([]);

    const randomData = (params) => {
        setData(Array.from(Array(MathExtra.randInt(10, 100))).map((x) => MathExtra.randInt(10, 100)));
    };
    useEffect(() => {
        randomData();
        return () => {};
    }, []);

    return (
        <>
            <button
                className="bg-red-500 p-3 block"
                onClick={(first) => {
                    randomData();
                }}
            >
                change data
            </button>

            <ChildTest1
                // index={count}
                data={data}
                {...props}
            />
        </>
    );
};
ParentTest1.propTypes = {};

export default ParentTest1;
