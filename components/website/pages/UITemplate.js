import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ListenerContext } from 'components/website/contexts/ListenerProvider';

const UITemplate = (props) => {
    const listener = useContext(ListenerContext);

    if (listener) {
        listener.useSubscription((e) => {
            onListen(e);
        });
    }

    const onListen = (e) => {
        const { type, data } = e;
        switch (type) {
            case '':
                break;

            default:
                break;
        }
    };

    return <div>UITemplate</div>;
};

UITemplate.propTypes = {};

export default UITemplate;
