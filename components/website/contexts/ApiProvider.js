import ApiCall from 'modules/ApiCall';
import { createContext, useContext } from 'react';
import { showNotifications } from 'modules/helpers/helpers';
import ObjectExtra from '@/plugins/utils/ObjectExtra';
// import { useRouter } from 'next/router';

export const ApiContext = createContext();

const ApiProvider = (props) => {
    // const router = useRouter();

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
        options.token = props.user.token;

        let res = await ApiCall(options);

        if (res) {
            try {
                let _msgs = res.message || ['Vui lòng kiểm trả lại thông tin!'];
                if (!Array.isArray(_msgs)) {
                    _msgs = [res.message];
                }
                const _isError = !ObjectExtra.toBool(res?.status);
                // show error notification even if it's disabled
                if (_isError) {
                    showNotifications(_msgs, _isError);

                    // if (res.data?.statusCode == 401) router.push('/');
                } else {
                    if (showNotif) showNotifications(_msgs, _isError);
                }
            } catch (error) {
                console.error('error at calling api', error);
            }
        } else {
            res = {
                status: false,
                message: 'Vui lòng kiểm trả lại thông tin!',
            };
        }

        return res;
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
