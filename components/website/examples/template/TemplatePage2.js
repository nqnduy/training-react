import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ListenerContext, StateContext } from 'pages/examples/template';

const TemplatePage2 = (props) => {
    const listener = useContext(ListenerContext);

    return (
        <div>
            {console.log('render TemplatePage2')}
            <div className="use-listener">
                <button
                    onClick={(params) => {
                        if (listener)
                            listener.emit({
                                type: 'changeStep',
                                step: 'STEP_1',
                            });
                    }}
                >
                    Change step to STEP_1 use listener
                </button>
            </div>

            <div className="use-listener">
                <button
                    onClick={(params) => {
                        listener.emit({
                            type: 'willCount',
                            diff: 2,
                        });
                    }}
                >
                    Sử dụng listener để emit counting nhưng không hiển thị ở component
                </button>
            </div>
        </div>
    );
};

TemplatePage2.propTypes = {};

export default TemplatePage2;
