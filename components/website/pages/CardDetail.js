import React, { memo } from 'react';
import PropTypes from 'prop-types';

const CardDetail = ({ data, ...props }) => {
    return (
        <>
            {console.log('render carddetail')}
            <span className="block text-4xl text-white">{data}</span>
        </>
    );
};

CardDetail.propTypes = {};

export default CardDetail;
