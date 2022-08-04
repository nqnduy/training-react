import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Table, Divider, DatePicker } from 'antd';
//
import LayoutPage from 'components/admin/LayoutPage';
import BlockSplitter from '@/diginext/elements/BlockSplitter';
import Card from '@/diginext/containers/Card';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import ApiCall from 'modules/ApiCall';
import { DefaultStyles } from 'components/admin/layout/AdminGlobalStyle';
import { showError, checkPermission } from '@/helpers/helpers';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import AdminButton, { ButtonType } from '@/dashkit/Buttons';
import moment from 'moment';

export const getServerSideProps = TrackingUserSession;

const AdminActivities = ({ user, children }) => {
    const router = useRouter();
    const [formSearchInput, setFormSearchInput] = useState({});
    const [tableData, setTableData] = useState([]);
    const [myTimeout, setMyTimeout] = useState();
    const [pagination, setPagination] = useState({});
    const [sorter, setSorter] = useState({});
    const [filter, setFilter] = useState();
    //Permissions
    const canList = checkPermission(user, 'activity_list');

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
            path: `/api/v1/admin/activities?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
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

    const handleSearch = function (isRest = false) {
        if (isRest) {
            setFormSearchInput({
                ...formSearchInput,
                createdFrom: '',
                createdTo: '',
            });
        }

        let currentFilter = '';
        let currentFormSearch = {
            createdFrom: !isRest ? formSearchInput.createdFrom || '' : '',
            createdTo: !isRest ? formSearchInput.createdTo || '' : '',
        };

        Object.keys(currentFormSearch).forEach(function (index) {
            currentFilter += `${index}=${currentFormSearch[index]}&`;
        });

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            fetchList(pagination, currentFilter, sorter);
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (user, row, index) => {
                return user?.name ? user.name : '';
            },
        },
        {
            title: 'Message',
            dataIndex: 'message_vi',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (message_vi, row, index) => {
                return message_vi;
            },
        },
        {
            title: 'Created date',
            dataIndex: 'createdAt',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Method',
            dataIndex: 'method',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
        },
    ];

    return (
        <LayoutPage user={user}>
            <BlockSplitter height={25} />
            <Divider orientation="left">Filter</Divider>
            <HorizontalList itemSize={ListItemSize.STRETCH}>
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
            <BlockSplitter />
            <BlockSplitter height={25} />
            <Card>
                <Table
                    rowKey={(item) => item.id}
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

export default AdminActivities;
