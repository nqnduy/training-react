import Compose from '@/components/website/contexts/Compose';
import ApiProvider from '@/components/website/contexts/ApiProvider';
// import ListenerProvider from '@/components/website/contexts/ListenerProvider';
import React from 'react';
import StorageProvider from '@/components/website/contexts/StorageProvider';
import AppApiCaller from '@/components/website/contexts/AppApiCaller';
import MainProvider from '@/components/website/contexts/MainProvider';

const Providers = (props) => {
    return (
        <Compose
            components={[
                //
                // ListenerProvider,
                StorageProvider,
                ApiProvider,
                AppApiCaller,
                MainProvider,
            ]}
            {...props}
        ></Compose>
    );
};

export default Providers;
