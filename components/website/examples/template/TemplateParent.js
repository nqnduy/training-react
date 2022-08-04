import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TemplateScene from './TemplateScene';

const TemplateParent = (props) => {
    const [main, setMain] = useState(<TemplateScene />);

    return (
        <>
            {console.log('render TemplateParent')}
            {main}
        </>
    );
};

TemplateParent.propTypes = {};

export default TemplateParent;
