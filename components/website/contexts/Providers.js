import Compose from '@/components/website/contexts/Compose';
import ApiProvider from '@/components/website/contexts/ApiProvider';
import ListenerProvider from '@/components/website/contexts/ListenerProvider';
import React from 'react';

const Providers = (props) => {
    return <Compose components={[ListenerProvider, ApiProvider]} {...props}></Compose>;
};

export default Providers;
