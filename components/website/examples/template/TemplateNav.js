import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/diginext/button/Button';
import { ListenerContext, StateContext } from 'pages/examples/template';

const list = ['STEP_1', 'STEP_2', 'STEP_3'];

const TemplateNav = (props) => {
    //
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
            case '':
                break;

            default:
                break;
        }
    };

    const clickNav = (e) => {
        const step = e.target.attributes.getNamedItem('step').value;
        listener.emit({
            type: 'changeStep',
            step,
        });
    };

    return (
        <>
            <style jsx>{``}</style>

            {console.log('render TemplateNav')}

            <div className="nav">
                {list.map((item, index) => {
                    return (
                        <Button step={item} onClick={clickNav} key={index}>
                            {item}
                        </Button>
                    );
                })}
            </div>
        </>
    );
};

TemplateNav.propTypes = {};

export default TemplateNav;
