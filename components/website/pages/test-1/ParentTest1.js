import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChildTest1 from './ChildTest1';

const ParentTest1 = (props) => {
    return (
        <>
            <ChildTest1 {...props} />
        </>
    );
};
ParentTest1.propTypes = {};

export default ParentTest1;
