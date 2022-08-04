import React from 'react';
import MasterPageBasic from '@/components/website/master/MasterPageBasic';
import dynamic from 'next/dynamic';

{
    /* - CHANGE THIS COMPONENT FOR EACH OF PAGE */
}
const UITemplate = dynamic(() => import('components/website/pages/UITemplate'));

const template = (props) => {
    return (
        <>
            <MasterPageBasic>
                {/* - CHANGE THIS COMPONENT FOR EACH OF PAGE */}
                <UITemplate />
            </MasterPageBasic>
        </>
    );
};

export default template;
