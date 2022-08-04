import { Upload, Modal, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useCallback } from 'react';
import { showError } from '@/helpers/helpers';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
const type = 'DragableUploadList';

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
    const ref = React.useRef();
    const index = fileList?.indexOf(file) || 0;
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: (item) => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        type,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));
    const errorNode = <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>;
    return (
        <div ref={ref} className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`} style={{ cursor: 'move' }}>
            {file.status === 'error' ? errorNode : originNode}
        </div>
    );
};

const MultipleImage = (props) => {
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isJpgOrPng) {
            let res = {
                status: false,
                message: 'You can only upload jpg/png/jpeg file!',
            };
            return showError(res);
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            let res = {
                status: false,
                message: 'Image must smaller than 10MB!',
            };
            return showError(res);
        }

        return isJpgOrPng && isLt10M;
    }

    const [uploadFiles, setUploadFiles] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
    });

    const getBase64 = function (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCancel = function () {
        setUploadFiles({
            ...uploadFiles,
            previewVisible: false,
        });
    };

    const handlePreview = async function (file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setUploadFiles({
            ...uploadFiles,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    const handleChange = function ({ fileList }) {
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].status == 'uploading') {
                fileList[i].status = 'done';
            }
        }
        let formInput = props.formInput;
        formInput[props.name] = fileList;
        props.setFormInput({
            ...formInput,
        });
    };

    const customRequest = async function (data) {
        return data.onSuccess((res, file) => {});
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = props.formInput[props.name][dragIndex];
            const newData = update(props.formInput[props.name], {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragRow],
                ],
            });
            let formInput = props.formInput;
            formInput[props.name] = newData;
            props.setFormInput({
                ...formInput,
            });
        },
        [props.formInput[props.name]]
    );

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Upload
                    listType="picture-card"
                    fileList={props.formInput[props.name]}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    multiple
                    // onChange={onChange}
                    itemRender={(originNode, file) => (
                        <DragableUploadListItem originNode={originNode} file={file} fileList={props.formInput[props.name]} moveRow={moveRow} />
                    )}
                >
                    {typeof props.formInput[props.name] != 'undefined' && props.formInput[props.name].length >= props.maxImage ? null : uploadButton}
                </Upload>
            </DndProvider>
            <Modal visible={uploadFiles.previewVisible} title={uploadFiles.previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={uploadFiles.previewImage} />
            </Modal>
        </>
    );
};

export default MultipleImage;
