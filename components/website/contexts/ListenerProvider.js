import { useEventEmitter } from 'ahooks';
import { createContext, useContext } from 'react';

export const ListenerContext = createContext();

const ListenerProvider = (props) => {
    const listener = useEventEmitter();

    return <ListenerContext.Provider value={listener}>{props.children}</ListenerContext.Provider>;
};

export default ListenerProvider;

export const useListener = (props = {}) => {
    const context = useContext(ListenerContext);

    return context;
};
