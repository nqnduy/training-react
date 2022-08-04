import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChildTest2 from './ChildTest2';
import { Button } from 'antd';

const listStep = ['step-login', 'step-game', 'step-result', 'step-leaderboard'];

const ParentTest2 = (props) => {
    const [step, setStep] = useState(listStep[0]);

    useEffect(() => {
        return () => {};
    }, [step]);

    return (
        <>
            <div className="block step">
                {step}
                <Button
                    className="block"
                    onClick={() => {
                        let index = listStep.findIndex((x) => x == step);
                        if (index + 1 <= listStep.length - 1) index = index + 1;
                        else index = 0;
                        setStep(listStep[index]);
                    }}
                >
                    Change Step
                </Button>
            </div>

            <ChildTest2 {...props} />
        </>
    );
};
ParentTest2.propTypes = {};

export default ParentTest2;
