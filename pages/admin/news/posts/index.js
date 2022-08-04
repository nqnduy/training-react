import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { Popconfirm, Table, Divider, Select, Image, DatePicker } from 'antd';
//
import PageHeader from '@/dashkit/PageHeader';
import LayoutPage from 'components/admin/LayoutPage';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import AdminButton, { ButtonSize, ButtonType } from '@/dashkit/Buttons';
import BlockSplitter from '@/diginext/elements/BlockSplitter';
import { Input, InputSelect } from '@/diginext/form/Form';
import Card from '@/diginext/containers/Card';
import ApiCall from 'modules/ApiCall';
import AdminIcon from '@/dashkit/Icon';
import { DefaultStyles } from 'components/admin/layout/AdminGlobalStyle';
import { showSuccess, showError, checkPermission, showNotifications } from '@/helpers/helpers';
import { getObjectTrans } from '@/helpers/translation';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import { PostStatusTrans, ViewStatuses } from '@/constants/post';
import moment from 'moment';
import CONFIG from 'web.config';
import { kebabCase } from 'lodash';

export const getServerSideProps = TrackingUserSession;

const AdminPostsPage = ({ user, children }) => {
    const router = useRouter();
    const formSearchRef = useRef({});
    const [formSearchInput, setFormSearchInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [sorter, setSorter] = useState({});
    const [filter, setFilter] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectionType, setSelectionType] = useState('checkbox');
    const [postCategories, setPostCategories] = useState([]);

    //Permissions
    const canList = checkPermission(user, 'post_list');
    const canCreate = checkPermission(user, 'post_add');
    const canEdit = checkPermission(user, 'post_edit');
    const canDetail = checkPermission(user, 'post_detail');
    const canDelete = checkPermission(user, 'post_delete');
    const canPostCategoryList = checkPermission(user, 'post_category_list');
    //
    const dateFormat = 'YYYY-MM-DD';

    //Init load
    useEffect(function () {
        if (!canList) {
            router.push('/admin');
        } else {
            fetchList();
            if (canPostCategoryList) fetchCategories();
        }
    }, []);

    //Methods
    const fetchList = async function (pagination = null, filters = null, sorter = null) {
        let limit = pagination == null ? 10 : pagination.pageSize;
        let page = pagination == null ? 1 : pagination.current;
        let orderBy = sorter != null && typeof sorter['field'] != 'undefined' ? sorter.field : '_id';
        let order = sorter == null ? -1 : sorter.order == 'ascend' ? 1 : -1;
        let filtera = typeof filters == 'string' ? filters : filter;
        let params = {
            router,
            path: `/api/v1/admin/posts?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let list = res.data.list;
        let paginator = res.data.paginator;
        setTableData(list);
        setPagination({
            current: paginator.currentPage,
            pageSize: paginator.limit,
            pageSizeOptions: [10, 20, 50],
            showSizeChanger: true,
            showTitle: true,
            total: paginator.total,
        });
        setSorter({
            field: orderBy,
            order: order,
        });
        setFilter(filtera);
    };

    const fetchCategories = function () {
        ApiCall({
            router,
            path: `/api/v1/admin/post-categories?get=true`,
            token: user.token,
        }).then((res) => {
            if (res.status && res.data) {
                setPostCategories(res.data);
            } else {
                setPostCategories([]);
            }
        });
    };

    const handleDeleteMany = function (id = null) {
        let ids = [];
        if (id) {
            ids.push(id);
        } else {
            ids = selectedRowKeys;
        }
        ApiCall({
            router,
            path: `/api/v1/admin/posts`,
            method: 'DELETE',
            token: user.token,
            data: {
                ids: selectedRowKeys.length ? selectedRowKeys : [id],
            },
        }).then((res) => {
            if (res.status) {
                showSuccess(res);
                fetchList(pagination, filter, sorter);
                if (!id) {
                    setSelectedRowKeys([]);
                }
            } else {
                showError(res);
            }
        });
    };

    const handleSearch = function (isRest = false, isExport = false) {
        if (isRest) {
            formSearchRef.current.title.value, (formSearchRef.current.postCategory.value = '');
            formSearchRef.current.status.value = '';
            setFormSearchInput({
                ...formSearchInput,
                createdFrom: '',
                createdTo: '',
            });
        }

        let currentFilter = '';
        let currentFormSearch = {
            title: formSearchRef.current.title.value,
            postCategoryIn: !isRest && !formSearchRef.current.postCategory.value ? [formSearchRef.current.postCategory.value.value] : [],
            status: isRest || !formSearchRef.current.status.value ? '' : formSearchRef.current.status.value.value,
        };

        Object.keys(currentFormSearch).forEach(function (index) {
            currentFilter += `${index}=${currentFormSearch[index]}&`;
        });

        if (isExport) {
            let exportUrl = `${CONFIG.NEXT_PUBLIC_API_BASE_PATH}/api/v1/admin/posts?get=true&export=true&${currentFilter}&token=${user.token}`;
            window.location.href = exportUrl;
            return;
        }

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            fetchList(pagination, currentFilter, sorter);
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: function renderImage(image) {
                return <Image alt={kebabCase(image)} src={image} width={200} />;
            },
        },
        {
            title: 'Title',
            dataIndex: 'title',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: function renderTitle(title, row, index) {
                return getObjectTrans(title);
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: function renderStatus(status) {
                return PostStatusTrans()[status];
            },
        },
        {
            title: 'Created date',
            dataIndex: 'createdAt',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: function renderActions(text, row) {
                return (
                    <>
                        <AdminButton
                            onClick={() => router.push(`/admin/news/posts/edit/${row.id}`)}
                            size={ButtonSize.SMALL}
                            style={{ marginRight: '5px', display: !canDetail ? 'none' : '' }}
                        >
                            <AdminIcon name="edit" width={14} />
                        </AdminButton>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteMany(row.id)}>
                            <AdminButton
                                type={ButtonType.DANGER}
                                size={ButtonSize.SMALL}
                                style={{ marginRight: '5px', display: !canDelete ? 'none' : '' }}
                            >
                                <AdminIcon name="delete" width={14} />
                            </AdminButton>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const createBtn = (
        <React.Fragment>
            {canDelete ? (
                <AdminButton onClick={() => handleDeleteMany(null)} style={{ margin: '2px' }} type={ButtonType.DANGER}>
                    Delete
                </AdminButton>
            ) : (
                ''
            )}
            {canCreate ? <AdminButton href="/admin/news/posts/create">Create</AdminButton> : ''}
        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title="Post" button={createBtn} separator={true}>
            List
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <BlockSplitter height={25} />

            <Divider orientation="left">Filter</Divider>
            <HorizontalList itemSize="stretch">
                <ListItem style={{ marginRight: '1rem' }}>
                    <Input ref={(el) => (formSearchRef.current.title = el)} label="Title" placeholder="Title" maxLength="255" />
                </ListItem>
                <ListItem style={{ marginRight: '1rem' }}>
                    <InputSelect
                        ref={(el) => (formSearchRef.current.postCategory = el)}
                        label={<label style={{ display: 'inline-block' }}>Category</label>}
                        labelInValue
                        defaultValue={{ value: '', label: 'None' }}
                    >
                        <Select.Option value="">None</Select.Option>
                        {postCategories.map(function (category) {
                            return (
                                <Select.Option key={category.id} value={category.id}>
                                    {getObjectTrans(category.name)}
                                </Select.Option>
                            );
                        })}
                    </InputSelect>
                </ListItem>
                <ListItem style={{ marginRight: '1rem' }}>
                    <InputSelect
                        ref={(el) => (formSearchRef.current.status = el)}
                        label={<label style={{ display: 'inline-block' }}>Status</label>}
                        labelInValue
                        defaultValue={{ value: '', label: 'None' }}
                    >
                        <Select.Option value={''}>None</Select.Option>
                        {Object.keys(ViewStatuses(user)).map(function (status) {
                            return (
                                <Select.Option key={status} value={status}>
                                    {ViewStatuses(user)[status]}
                                </Select.Option>
                            );
                        })}
                    </InputSelect>
                </ListItem>
            </HorizontalList>
            <HorizontalList itemSize="stretch">
                <ListItem style={{ marginRight: '1rem' }}>
                    <label>From-To</label> <br />
                    <DatePicker
                        size="large"
                        value={formSearchInput.createdFrom ? moment(formSearchInput.createdFrom, dateFormat) : ''}
                        format={dateFormat}
                        onChange={(date, dateString) =>
                            setFormSearchInput({
                                ...formSearchInput,
                                createdFrom: dateString,
                            })
                        }
                    />
                    <DatePicker
                        size="large"
                        value={formSearchInput.createdTo ? moment(formSearchInput.createdTo, dateFormat) : ''}
                        format={dateFormat}
                        onChange={(date, dateString) =>
                            setFormSearchInput({
                                ...formSearchInput,
                                createdTo: dateString,
                            })
                        }
                    />
                </ListItem>
            </HorizontalList>
            <AdminButton onClick={(e) => handleSearch(false)} style={{ margin: '2px' }} type={ButtonType.INFO}>
                Search
            </AdminButton>
            <AdminButton onClick={(e) => handleSearch(true)} style={{ margin: '2px' }} type={ButtonType.SECONDARY}>
                Reset
            </AdminButton>
            <AdminButton onClick={(e) => handleSearch(false, true)} style={{ margin: '2px' }} type={ButtonType.WARNING}>
                Export
            </AdminButton>
            <BlockSplitter />
            <BlockSplitter height={25} />
            <Card>
                <Table
                    rowKey={(item) => item.id}
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={tableData}
                    scroll={{ x: DefaultStyles.container.maxWidthMD }}
                    pagination={pagination}
                    onChange={fetchList}
                />
            </Card>
            <BlockSplitter />
        </LayoutPage>
    );
};

export default AdminPostsPage;
