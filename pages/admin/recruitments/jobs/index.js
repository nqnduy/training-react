import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Select, Popconfirm, DatePicker } from 'antd';
//
import LayoutPage from 'components/admin/LayoutPage';
import { DefaultStyles } from 'components/admin/layout/AdminGlobalStyle';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize, ButtonType } from '@/dashkit/Buttons';
import AdminBadge from '@/dashkit/Badges';
import AdminIcon from '@/dashkit/Icon';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import BlockSplitter from '@/diginext/elements/BlockSplitter';
import { Input, InputSelect } from '@/diginext/form/Form';
import Card from '@/diginext/containers/Card';
import { showSuccess, showError, checkPermission } from '@/helpers/helpers';
import { getObjectTrans } from '@/helpers/translation';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import ApiCall from 'modules/ApiCall';
import moment from 'moment';
import CONFIG from 'web.config';
export const getServerSideProps = TrackingUserSession;

const AdminJobsPage = ({ user, children }) => {
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
    const [contractList, setContractList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    //Permissions
    const canList = checkPermission(user, 'job_list');
    const canCreate = checkPermission(user, 'job_add');
    const canEdit = checkPermission(user, 'job_edit');
    const canDetail = checkPermission(user, 'job_detail');
    const canDelete = checkPermission(user, 'job_delete');
    const canContractList = checkPermission(user, 'job_contract_list');
    const canDepartmentList = checkPermission(user, 'job_department_list');
    //
    const dateFormat = 'YYYY-MM-DD';

    //Init load
    useEffect(function () {
        if (!canList) {
            router.push('/admin');
        } else {
            if (canContractList) fetchContractList();
            if (canDepartmentList) fetchDepartmentList();
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
            path: `/api/v1/admin/jobs?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
            token: user.token,
        };
        let res = await ApiCall(params);
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

    const fetchContractList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/job-contracts?get=true&selects=id,name&orderBy=id&order=1`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setContractList(res.data || []);
    };

    const fetchDepartmentList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/job-departments?get=true&selects=id,name&orderBy=id&order=1`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setDepartmentList(res.data || []);
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
            path: `/api/v1/admin/jobs`,
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
            formSearchRef.current.title.value = '';
            formSearchRef.current.location.value = '';
            formSearchRef.current.active.value = '';
            formSearchRef.current.jobContract.value = '';
            formSearchRef.current.jobDepartment.value = '';
            setFormSearchInput({
                ...formSearchInput,
                createdFrom: '',
                createdTo: '',
            });
        }

        let currentFilter = '';
        let jobContract = formSearchRef.current.jobContract.value.value;
        let jobDepartment = formSearchRef.current.jobDepartment.value.value;
        let currentFormSearch = {
            title: formSearchRef.current.title.value,
            location: formSearchRef.current.location.value,
            active: isRest || !formSearchRef.current.active.value ? '' : formSearchRef.current.active.value.value,
            jobContract: jobContract != null && !isRest ? jobContract : '',
            jobDepartment: jobDepartment != null && !isRest ? jobDepartment : '',
            createdFrom: !isRest ? formSearchInput.createdFrom || '' : '',
            createdTo: !isRest ? formSearchInput.createdTo || '' : '',
        };

        Object.keys(currentFormSearch).forEach(function (index) {
            currentFilter += `${index}=${currentFormSearch[index]}&`;
        });

        if (isExport) {
            let exportUrl = `${CONFIG.NEXT_PUBLIC_API_BASE_PATH}/api/v1/admin/jobs?get=true&export=true&${currentFilter}&token=${user.token}`;
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
            title: 'Title',
            dataIndex: 'title',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (title, row, index) => {
                return getObjectTrans(title);
            },
        },
        {
            title: 'Contract',
            dataIndex: 'jobContract',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (jobContract, row, index) => {
                return jobContract && jobContract.name.vi ? jobContract.name.vi : '';
            },
        },
        {
            title: 'Department',
            dataIndex: 'jobDepartment',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (jobDepartment, row, index) => {
                return jobDepartment && jobDepartment.name.vi ? jobDepartment.name.vi : '';
            },
        },
        {
            title: 'Location',
            dataIndex: 'location',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (location, row, index) => {
                return getObjectTrans(location);
            },
        },
        {
            title: 'Status',
            dataIndex: 'active',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: function renderStatus(active) {
                return (
                    <AdminBadge size={ButtonSize.SMALL} type={active ? ButtonType.SUCCESS : ButtonType.SECONDARY}>
                        {active ? 'Active' : 'Disabled'}
                    </AdminBadge>
                );
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
                            onClick={() => router.push(`/admin/recruitments/jobs/edit/${row.id}`)}
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
            {canCreate ? <AdminButton href="/admin/recruitments/jobs/create">Create</AdminButton> : ''}
        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title={`Job (${pagination.total || 0})`} button={createBtn} separator={true}>
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
                    <Input ref={(el) => (formSearchRef.current.location = el)} label="Location" placeholder="Location" maxLength="255" />
                </ListItem>
                <ListItem style={{ marginRight: '1rem' }}>
                    <InputSelect
                        ref={(el) => (formSearchRef.current.active = el)}
                        label={<label style={{ display: 'inline-block' }}>Status</label>}
                        labelInValue
                        defaultValue={{ value: '', label: 'None' }}
                    >
                        <Select.Option value="">None</Select.Option>
                        <Select.Option value={true}>Active</Select.Option>
                        <Select.Option value={false}>Disabled</Select.Option>
                    </InputSelect>
                </ListItem>
            </HorizontalList>
            <HorizontalList itemSize="stretch">
                {contractList ? (
                    <ListItem style={{ marginRight: '1rem' }}>
                        <InputSelect
                            ref={(el) => (formSearchRef.current.jobContract = el)}
                            label={<label style={{ display: 'inline-block' }}>Contract</label>}
                            labelInValue
                            defaultValue={{ value: '', label: 'None' }}
                        >
                            <Select.Option value="">None</Select.Option>
                            {contractList.map(function (contract) {
                                return (
                                    <Select.Option key={contract.id} value={contract.id}>
                                        {getObjectTrans(contract.name)}
                                    </Select.Option>
                                );
                            })}
                        </InputSelect>
                    </ListItem>
                ) : (
                    ''
                )}
                {departmentList ? (
                    <ListItem style={{ marginRight: '1rem' }}>
                        <InputSelect
                            ref={(el) => (formSearchRef.current.jobDepartment = el)}
                            label={<label style={{ display: 'inline-block' }}>Department</label>}
                            labelInValue
                            defaultValue={{ value: '', label: 'None' }}
                        >
                            <Select.Option value="">None</Select.Option>
                            {departmentList.map(function (department) {
                                return (
                                    <Select.Option key={department.id} value={department.id}>
                                        {getObjectTrans(department.name)}
                                    </Select.Option>
                                );
                            })}
                        </InputSelect>
                    </ListItem>
                ) : (
                    ''
                )}
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

export default AdminJobsPage;
