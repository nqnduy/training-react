import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { Popconfirm, Table, Divider, Select, DatePicker } from 'antd';
//
import LayoutPage from 'components/admin/LayoutPage';
import { DefaultStyles } from 'components/admin/layout/AdminGlobalStyle';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize, ButtonType } from '@/dashkit/Buttons';
import AdminIcon from '@/dashkit/Icon';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import BlockSplitter from '@/diginext/elements/BlockSplitter';
import { Input, InputSelect } from '@/diginext/form/Form';
import Card from '@/diginext/containers/Card';
import ApiCall from 'modules/ApiCall';
import { showSuccess, showError, checkPermission, showNotifications } from '@/helpers/helpers';
import { ApplicantStatusTrans } from '@/constants/job';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import moment from 'moment';
import CONFIG from 'web.config';

export const getServerSideProps = TrackingUserSession;

const AdminJobApplicantsPage = ({ user, children }) => {
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
    const [jobList, setJobList] = useState([]);

    //Permissions
    const canList = checkPermission(user, 'job_applicant_list');
    const canCreate = checkPermission(user, 'job_applicant_add');
    const canEdit = checkPermission(user, 'job_applicant_edit');
    const canDetail = checkPermission(user, 'job_applicant_detail');
    const canDelete = checkPermission(user, 'job_applicant_delete');
    //
    const dateFormat = 'YYYY-MM-DD';

    //Init load
    useEffect(function () {
        if (!canList) {
            router.push('/admin');
        } else {
            fetchList();
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
            path: `/api/v1/admin/job-applicants?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
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

    const handleDeleteMany = function (id = null) {
        let ids = [];
        if (id) {
            ids.push(id);
        } else {
            ids = selectedRowKeys;
        }
        ApiCall({
            router,
            path: `/api/v1/admin/job-applicants`,
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
            formSearchRef.current.nameNon.value = '';
            formSearchRef.current.phone.value = '';
            formSearchRef.current.status.value = '';
            setFormSearchInput({
                ...formSearchInput,
                createdFrom: '',
                createdTo: '',
            });
        }

        let currentFilter = '';
        let currentFormSearch = {
            nameNon: formSearchRef.current.nameNon.value,
            phone: formSearchRef.current.phone.value,
            status: isRest || !formSearchRef.current.status.value ? '' : formSearchRef.current.status.value.value,
            createdFrom: !isRest ? formSearchInput.createdFrom || '' : '',
            createdTo: !isRest ? formSearchInput.createdTo || '' : '',
        };

        Object.keys(currentFormSearch).forEach(function (index) {
            currentFilter += `${index}=${currentFormSearch[index]}&`;
        });

        if (isExport) {
            let exportUrl = `${CONFIG.NEXT_PUBLIC_API_BASE_PATH}/api/v1/admin/job-applicants?get=true&export=true&${currentFilter}&token=${user.token}`;
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
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: function renderName(name, row, index) {
                return name;
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: function renderPhone(phone, row, index) {
                return phone;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: function renderStatus(status) {
                return ApplicantStatusTrans()[status];
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
                            onClick={() => router.push(`/admin/recruitments/job-applicants/edit/${row.id}`)}
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
            {canCreate ? <AdminButton href="/admin/recruitments/job-applicants/create">Create</AdminButton> : ''}
        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title={`Applicant (${pagination.total || 0})`} button={createBtn} separator={true}>
            List
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <BlockSplitter height={25} />
            <Divider orientation="left">Filter</Divider>
            <HorizontalList itemSize="stretch">
                <ListItem style={{ marginRight: '1rem' }}>
                    <Input ref={(el) => (formSearchRef.current.nameNon = el)} label="Name" placeholder="Name" maxLength="255" />
                </ListItem>
                <ListItem style={{ marginRight: '1rem' }}>
                    <Input ref={(el) => (formSearchRef.current.phone = el)} label="Phone" placeholder="Phone" maxLength="255" />
                </ListItem>
                <ListItem style={{ marginRight: '1rem' }}>
                    <InputSelect
                        ref={(el) => (formSearchRef.current.status = el)}
                        label={<label style={{ display: 'inline-block' }}>Status</label>}
                        labelInValue
                        defaultValue={{ value: '', label: 'None' }}
                    >
                        <Select.Option value={''}>None</Select.Option>
                        {Object.keys(ApplicantStatusTrans()).map(function (status) {
                            return (
                                <Select.Option key={status} value={status}>
                                    {ApplicantStatusTrans()[status]}
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

export default AdminJobApplicantsPage;
