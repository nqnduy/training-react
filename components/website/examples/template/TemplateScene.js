import React, { useContext, useEffect, useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import PropTypes from 'prop-types';
import TemplatePage1 from './TemplatePage1';
import TemplatePage2 from './TemplatePage2';
import { ListenerContext, StateContext } from 'pages/examples/template';
import TemplateNav from './TemplateNav';
import TemplatePage3 from './TemplatePage3';

const TemplateScene = (props) => {
    // Gọi listener ra từ parent
    const { stepName, setStepName } = useContext(StateContext);

    const listener = useContext(ListenerContext);

    if (listener)
        listener.useSubscription((e) => {
            // nay de nghe , con emit de noi
            onListen(e);
        });

    const onListen = (e) => {
        const type = e.type;
        switch (type) {
            case 'changeStep':
                const step = e.step;
                if (stepName != step) onChangeStepByName(step);
                break;

            default:
                break;
        }
    };

    // Kết thúc Khai báo listener

    // Khai báo animation

    const [stylesMain, setStylesMain] = useSpring(() => ({
        // config: { ... }
        from: { opacity: 0 },
        to: { opacity: 1 },
    }));

    // const stylesMain = useSpring({
    //     ...animateMainProp,
    //     onRest() {
    //         console.log('onRest:')
    //     }
    // })

    //

    const step1 = (params) => {
        return <TemplatePage1 listener={listener} />;
    };

    const step2 = (params) => {
        return <TemplatePage2 listener={listener} />;
    };

    const step3 = (params) => {
        return <TemplatePage3 listener={listener} />;
    };

    // Xử lý step

    // check step change
    useEffect(() => {
        // effect
        console.log('stepName :>> ', stepName);
        switch (stepName) {
            case 'STEP_1':
                setMain(step1());
                break;

            case 'STEP_2':
                setMain(step2());
                break;

            case 'STEP_3':
                setMain(step3());
                break;

            default:
                break;
        }
        return () => {
            // cleanup
        };
    }, [stepName]);

    //Bước này dễ sau này có test new step thì thực hiện nhanh hơn
    const defaulStep = (params) => {
        onChangeStepByName('STEP_1');
    };

    // animation change step
    const onChangeStepByName = (step) => {
        //FADE OUT
        setStylesMain({
            from: { opacity: 1 },
            to: { opacity: 0 },
            clamp: true,
            config: { duration: 300 },

            onRest() {
                // complete fade out
                setStepName(step);

                //FADE IN
                setStylesMain({
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                    clamp: true,
                });
            },
        });
    };

    //

    useEffect(() => {
        // Step đầu tiên sau khi component được init
        defaulStep();

        return () => {
            // cleanup
            setMain(<></>);
            setNav(<></>);
        };
    }, []);

    const [nav, setNav] = useState(<TemplateNav />);
    const [main, setMain] = useState(<> </>);

    return (
        <>
            <style jsx>{``}</style>

            {console.log('render TemplateScene')}

            {nav}

            <animated.div style={stylesMain} className="holder">
                {main}
            </animated.div>
        </>
    );
};

TemplateScene.propTypes = {};

export default TemplateScene;
