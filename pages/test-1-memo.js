import React from 'react';
import MasterPageBasic from '@/components/website/master/MasterPageBasic';
import dynamic from 'next/dynamic';

{
    /* - CHANGE THIS COMPONENT FOR EACH OF PAGE */
}
const UITest1 = dynamic(() => import('components/website/pages/UITest1'));

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
            <MasterPageBasic>
                {/* - CHANGE THIS COMPONENT FOR EACH OF PAGE */}
                <UITest1 />
            </MasterPageBasic>
        </>
    );
};

export default template;
