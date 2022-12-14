import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppApiCaller } from 'components/website/contexts/AppApiCaller';
import { useMain } from 'components/website/contexts/MainProvider';
import { Button } from 'antd';

const UITest3 = ({ ...props }) => {
    const { callLogin } = useAppApiCaller();
    const { loginCustomer } = useMain();

    const onCLickLogin = (params) => {
        callLogin({ user: '1' });
    };

    return (
        <>
            <Button onClick={onCLickLogin}>Login</Button>
        </>
    );
};

UITest3.propTypes = {};

export default UITest3;
