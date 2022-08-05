import React from 'react';
import MasterPageBasic from '@/components/website/master/MasterPageBasic';
import dynamic from 'next/dynamic';

{
    /* - CHANGE THIS COMPONENT FOR EACH OF PAGE */
}
const UITest3 = dynamic(() => import('components/website/pages/UITest3'));

const template = (props) => {
    return (
        <>
            <style global jsx>{`
                html,
                body {
                    background-color: black;
                    color: white;
                }
            `}</style>
            <MasterPageBasic user={{ token: '123' }}>
                {/* - CHANGE THIS COMPONENT FOR EACH OF PAGE */}
                <UITest3 />
            </MasterPageBasic>
        </>
    );
};

export default template;
