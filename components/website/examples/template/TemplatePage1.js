import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ListenerContext, StateContext } from 'pages/examples/template';

const TemplatePage1 = (props) => {
    const { count, setCount } = useContext(StateContext);

    const listener = useContext(ListenerContext);
    return (
        <>
            <style jsx>{`
                div,
                h2 {
                    color: white;
                }
            `}</style>

            <div>
                {console.log('render TemplatePage1')}
                <div className="use-setCount">
                    <button
                        onClick={(params) => {
                            setCount(count + 1);
                        }}
                    >
                        Sử dụng setCount ở ngoài parent truyền vào từ provider
                    </button>

                    <div className="code">
                        <code> setCount(count + 1)</code>
                    </div>
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
                        Sử dụng listener để emit counting
                    </button>
                </div>
                <div className="code">
                    <code>
                        {' '}
                        {`listener.emit({
                type: "willCount",
                diff: 2
                    })`}
                    </code>
                </div>
                ----
                <div className="result">
                    <h2>{`Lấy count ở ngoài parent hiện thị lên: ${count}`}</h2>
                </div>
            </div>
        </>
    );
};

TemplatePage1.propTypes = {};

export default TemplatePage1;
