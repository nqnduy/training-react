import { useEventEmitter } from 'ahooks';
import { createContext, useContext, useState } from 'react';
import EventName from 'modules/data/EventName';
import { ListenerContext } from '@/components/website/contexts/ListenerProvider';
import LightningLoader from '@/components/website/loader/LightningLoader';
import LightningLoaderWithText from '@/components/website/loader/LightningLoaderWithText';

export const LoaderContext = createContext();

const LoaderProvider = (props) => {
    const listener = useContext(ListenerContext);

    if (listener) {
        listener.useSubscription((e) => {
            // nay de nghe , con emit de noi
            onListen(e);
        });
    }

    const onListen = (e) => {
        const type = e.type;
        switch (type) {
            case EventName.SHOW_LOADER:
                showLoader();
                break;

            case EventName.HIDE_LOADER:
                hideLoader();
                break;
            default:
                break;
        }
    };

    const [main, setMain] = useState(<></>);

    const showLoader = (params) => {
        console.log('__showLoader');
        setMain(<LightningLoaderWithText />);
    };

    const hideLoader = (params) => {
        console.log('__hideLoader');
        setMain(<></>);
    };

    return (
        <LoaderContext.Provider
            value={{
                showLoader,
                hideLoader,
            }}
        >
            {main}

            {props.children}
        </LoaderContext.Provider>
    );
};

export default LoaderProvider;
