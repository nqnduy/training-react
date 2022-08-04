import React, { useState, useEffect, forwardRef } from 'react';

const EmptyComponent = () => false;

const defaultModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video', 'code', 'code-block'],
        ['clean'],
    ],
};

const defaultFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'background',
    'align',
    'code',
    'code-block',
];

const NextQuill = forwardRef((props, ref) => {
    const [quill, setQuill] = useState(<EmptyComponent />);

    const { modules, formats, ...rest } = props;

    useEffect(() => {
        // (window);
        const ReactQuill = typeof window === 'object' ? require('react-quill') : <EmptyComponent />;
        setQuill(
            <ReactQuill ref={ref} modules={modules || defaultModules} formats={formats || defaultFormats} {...rest}>
                {props.children}
            </ReactQuill>
        );
    }, []);

    return quill;
});

export default NextQuill;
