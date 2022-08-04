import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Switch, Select, List, Image, Collapse } from 'antd';
//
import { DefaultStyles } from 'components/admin/layout/AdminGlobalStyle';
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import Section from '@/diginext/containers/Section';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import BlockSplitter from '@/diginext/elements/BlockSplitter';
import Card from '@/diginext/containers/Card';
import { Input, ValidationType, InputType } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, checkPermission, postGetForm, preSaveForm } from '@/helpers/helpers';
import ApiCall from 'modules/ApiCall';
import SingleImage from '@/diginext/upload/singleImage';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
const { Panel } = Collapse;

export const getServerSideProps = TrackingUserSession;

const AdminCustomersEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const { id } = router.query;
    //Const

    //Permissions
    const canEdit = checkPermission(user, 'customer_edit');
    const canDetail = checkPermission(user, 'customer_detail');

    //Init load
    useEffect(function () {
        if (!canDetail) {
            router.push('/admin');
        } else {
            fetchDetail();
        }
    }, []);

    // methods
    const fetchDetail = async function () {
        let params = {
            router,
            path: `/api/v1/admin/customers/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let formInput = res.data;
        postGetForm(formInput, ['profileImage']);
        setFormInput(formInput);
    };

    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let msgs = [];
        let currentFormInput = {
            active: formInput.active || false,
            name: formInputRef.current.name.value,
            password: formInputRef.current.password.value,
            email: formInputRef.current.email.value,
        };

        let password = formInputRef.current.password.value;
        let confirmPassword = formInputRef.current.confirmPassword.value;

        if (password != confirmPassword) {
            msgs.push('Mật khẩu xác nhận không trùng khớp!');
        }

        if (msgs.length) {
            return showMessages(msgs);
        }
        preSaveForm(formInput, currentFormInput, ['profileImage']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/customers/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/customers');
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    //Single Upload
    const handleChangeSingleUpload = function (type, data) {
        setFormInput({
            ...formInput,
            ...data,
        });
    };

    const header = (
        <PageHeader pretitle="admin" title="Customer" button={<BackButton />} separator={true}>
            Update
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <label style={{ marginBottom: '15px' }}>Ảnh đại diện</label>
                <HorizontalList style={{ width: '50%' }}>
                    <SingleImage name={'profileImage'} imageUrl={formInput.profileImageUrl} handleChange={handleChangeSingleUpload} />
                </HorizontalList>

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <div className="form-group">
                            <label style={{ marginRight: '15px' }}>Active</label>
                            <Switch
                                checked={formInput.active}
                                onChange={() => {
                                    setFormInput({
                                        ...formInput,
                                        active: !formInput.active,
                                    });
                                }}
                            />
                        </div>
                    </ListItem>
                </HorizontalList>

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.name = el)}
                            defaultValue={formInput.name}
                            label="Tên"
                            placeholder="Tên"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                </HorizontalList>

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.email = el)}
                            defaultValue={formInput.email}
                            label="Email"
                            placeholder="Email"
                            maxLength="255"
                        />
                    </ListItem>
                </HorizontalList>

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.password = el)}
                            defaultValue={formInput.password}
                            label="Mật khẩu"
                            type={InputType.PASSWORD}
                            placeholder="Mật khẩu"
                            maxLength="255"
                        />
                    </ListItem>
                    <ListItem>
                        <Input
                            ref={(el) => (formInputRef.current.confirmPassword = el)}
                            label="Xác nhận mật khẩu"
                            type={InputType.PASSWORD}
                            maxLength="255"
                        />
                    </ListItem>
                </HorizontalList>

                <AdminButton size={ButtonSize.LARGE} onClick={saveHandler} style={{ margin: '20px' }} disabled={!canEdit ? true : false}>
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    );
};

export default AdminCustomersEditPage;
