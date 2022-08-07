import React, { useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { useApiProvider } from 'components/website/contexts/ApiProvider';
import CONFIG from 'web.config';

export const AppApiCallerContext = createContext();

/**
 * Chứa function call api dùng chung nhiều nơi.
 * @param {*} props
 * @returns
 */
const AppApiCaller = (props) => {
    const { call, POST, PUT, GET, DELETE, PATCH } = useApiProvider();
    //

    const callLogin = async (data, isShowMessage = true) => {
        if (!data) return;

        const res = await POST({
            showNotif: isShowMessage,
            contentType: 'application/json',
            url: `${CONFIG.getBasePath()}/api/customer-login`,
            data,
        });

        return res;
    };

    return (
        <AppApiCallerContext.Provider
            value={{
                callLogin,
            }}
        >
            {props.children}
        </AppApiCallerContext.Provider>
    );
};

AppApiCaller.propTypes = {};

export default AppApiCaller;

export const useAppApiCaller = (props = {}) => {
    const context1 = useApiProvider();
    const context2 = useContext(AppApiCallerContext);

    return {
        ...context1,
        ...context2,
    };
};
