import { createContext, useContext, useState } from 'react';

export const StorageContext = createContext();

/**
 * Chứa state dùng chung nhiều nơi.
 * @param {*} props
 * @returns
 */

const StorageProvider = (props) => {
    //
    const user = props.user;

    const [data, setData] = useState();

    return (
        <StorageContext.Provider
            value={{
                user,
                data,
                setData,
            }}
        >
            {props.children}
        </StorageContext.Provider>
    );
};

export default StorageProvider;

export const useStorage = (props = {}) => {
    const context = useContext(StorageContext);

    return context;
};
