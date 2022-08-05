import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListenerContext } from 'components/website/contexts/ListenerProvider';
import { useAppApiCaller } from 'components/website/contexts/AppApiCaller';
import { useMain } from 'components/website/contexts/MainProvider';
import ParentTest2 from './test-2/ParentTest2';
import { Button } from 'antd';

const UITest3 = ({ ...props }) => {
    const { callLogin } = useAppApiCaller();
    const { loginCustomer } = useMain();

    useEffect(() => {
        return () => {};
    }, []);

    const onCLickLogin = (params) => {
        loginCustomer();
    };

    return (
        <>
            <Button onClick={onCLickLogin}>Login</Button>
        </>
    );
};

UITest3.propTypes = {};

export default UITest3;
