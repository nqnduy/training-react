import _ from 'lodash';

const getResponse = () => {
    return { status: 0, messages: [], data: {} };
};

const getSuccessResponse = (data, message) => {
    return { status: 1, messages: message ? [message] : [], data: data };
};

const getFailedResponse = (...messages) => {
    return { status: 0, messages: [...messages], data: {} };
};

export { getResponse, getSuccessResponse, getFailedResponse };
