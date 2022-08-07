import { useAppApiCaller } from '@/components/website/contexts/AppApiCaller';
import { useStorage } from '@/components/website/contexts/StorageProvider';
import { createContext, useState, useEffect, useContext } from 'react';

export const MainContext = createContext();

/**
 * Chứa function dùng chung nhiều nơi.
 * @param {*} props
 * @returns
 */
export default function MainProvider({ children }) {
    //

    const { callLogin } = useAppApiCaller();
    const { setData } = useStorage();

    const loginCustomer = async (params) => {
        if (!params) {
            console.log('something wrong, no data?');
            return;
        }
        //

        const res = await callLogin(params);

        if (res.data) {
            //
            console.log('set data');
            setData(res.data);
            return;
        }

        console.log('something wrong, đéo set data');
    };

    useEffect(() => {
        return () => {};
    }, []);

    return (
        <MainContext.Provider
            value={{
                //
                loginCustomer,
            }}
        >
            {children}
        </MainContext.Provider>
    );
}

export const useMain = (props = {}) => {
    return useContext(MainContext);
};
