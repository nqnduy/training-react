import React from 'react';
import MasterPageBasic from '@/components/website/master/MasterPageBasic';
import dynamic from 'next/dynamic';

{
    /* - CHANGE THIS COMPONENT FOR EACH OF PAGE */
}
const UITest1 = dynamic(() => import('components/website/pages/UITest1'));
// pages/test-1-memo.js

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
                <UITest1 />
                {/* - CHANGE THIS COMPONENT FOR EACH OF PAGE */}
            </MasterPageBasic>
        </>
    );
};

export default template;
