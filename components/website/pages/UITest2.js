import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListenerContext } from 'components/website/contexts/ListenerProvider';
import ParentTest2 from './test-2/ParentTest2';
import { Button } from 'antd';

const UITest2 = ({ ...props }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const listener = useContext(ListenerContext);

    if (listener) {
        listener.useSubscription((e) => {
            onListen(e);
        });
    }

    const onListen = (e) => {
        const { type, data } = e;
        switch (type) {
            case '':
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        return () => {};
    }, []);

    return (
        <>
            <button
                className="bg-yellow-200 text-black p-3 block"
                onClick={(first) => {
                    setCount(count + 1);
                }}
            >
                change state parent but red color - Count: {count}
            </button>

            <ParentTest2 />
        </>
    );
};

UITest2.propTypes = {};

export default UITest2;
