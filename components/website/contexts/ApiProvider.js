import ApiCall from 'modules/ApiCall';
import { createContext, useContext } from 'react';
import { showNotifications } from 'modules/helpers/helpers';
import ObjectExtra from '@/plugins/utils/ObjectExtra';

export const ApiContext = createContext();

const ApiProvider = (props) => {
    const POST = async (options) => {
        const res = await call({
            method: 'POST',
            ...options,
        });

        return res;
    };

    const PUT = async (options) => {
        const res = await call({
            method: 'PUT',
            ...options,
        });
        return res;
    };

    const DELETE = async (options) => {
        const res = await call({
            method: 'DELETE',
            ...options,
        });
        return res;
    };

    const PATCH = async (options) => {
        const res = await call({
            method: 'PATCH',
            ...options,
        });
        return res;
    };

    const GET = async (options) => {
        const res = await call({
            method: 'GET',
            ...options,
        });
        return res;
    };

    const call = async (options = {}) => {
        const showNotif = options.hasOwnProperty('showNotif') ? options['showNotif'] : false;

        const res = await ApiCall(options);

        if (res) {
            try {
                const _msgs = res.message || [];

                const _isError = !ObjectExtra.toBool(res.status);

                // show error notification even if it's disabled
                if (_isError) {
                    showNotifications(_msgs, _isError);
                } else {
                    if (showNotif) showNotifications(_msgs, _isError);
                }
            } catch (error) {
                console.error('error at calling api', error);
            }
        } else {
            console.warn('[ApiCall] failed');
            res = {
                status: false,
                message: '[ApiCall] failed',
            };
        }
    };

    return (
        <ApiContext.Provider
            value={{
                call,
                POST,
                PUT,
                GET,
                DELETE,
                PATCH,
            }}
        >
            {props.children}
        </ApiContext.Provider>
    );
};

export default ApiProvider;

export const useApiProvider = (props = {}) => {
    const context = useContext(ApiContext);

    return context;
};
