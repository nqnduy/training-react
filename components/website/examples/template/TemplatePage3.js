import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { StateContext } from 'pages/examples/template';

const TemplatePage3 = (props) => {
    return (
        <div>
            {console.log('render TemplatePage3')}

            <p>TemplatePage3</p>
        </div>
    );
};

TemplatePage3.propTypes = {};

export default TemplatePage3;
