import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ChildTest2 from './ChildTest2';
import ChildTest3 from './ChildTest3';
import { Button } from 'antd';

const listStep = ['step-login', 'step-game', 'step-result', 'step-leaderboard'];

const ParentTest2 = (props) => {
    //

    const [count, setCount] = useState(0);

    const [step, setStep] = useState(listStep[0]);

    
    useEffect(() => {
        console.log('step has changed', step);
        return () => {};
    }, [step]);

    const renderMain = (params) => {
        console.log('renderMain');

        switch (step) {
            case listStep[0]:
                return <ChildTest2 {...props} className="bg-red-400 inline-flex" />;

            case listStep[1]:
                return <ChildTest3 {...props} className="bg-blue-400 inline-flex" />;

            case listStep[2]:
                return <ChildTest2 {...props} className="bg-yellow-400 inline-flex" />;

            case listStep[3]:
                return <ChildTest3 {...props} className="bg-green-400 inline-flex" />;

            default:
                break;
        }
    };

    return (
        <>
            <button
                className="bg-blue-500 p-3 block"
                onClick={(first) => {
                    setCount(count + 1);
                }}
            >
                change state parent - Count: {count}
            </button>

            <div className="block step">
                <span className="text-5xl"> {step}</span>

                <button
                    className="bg-red-500 text-white p-3 block"
                    onClick={() => {
                        let index = listStep.findIndex((x) => x == step);
                        if (index + 1 <= listStep.length - 1) index = index + 1;
                        else index = 0;
                        setStep(listStep[index]);
                    }}
                >
                    Change Step
                </button>
            </div>

            {renderMain()}
        </>
    );
};
ParentTest2.propTypes = {};

export default ParentTest2;
