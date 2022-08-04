import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import Section from '@/diginext/containers/Section';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import { Input, ValidationType, InputType } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, checkPermission, preSaveForm } from '@/helpers/helpers';
import ApiCall from 'modules/ApiCall';
import SingleImage from '@/diginext/upload/singleImage';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';

export const getServerSideProps = TrackingUserSession;

const AdminCustomersCreatePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const { id } = router.query;
    //Const

    //Permissions
    const canCreate = checkPermission(user, 'customer_add');

    //Init load
    useEffect(function () {
        if (!canCreate) {
            router.push('/admin');
        } else {
        }
    }, []);

    // methods

    // save
    const saveHandler = function () {
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
                path: `/api/v1/admin/customers`,
                token: user.token,
                method: 'POST',
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
            Create
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
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <ListItem>
                        <Input
                            ref={(el) => (formInputRef.current.confirmPassword = el)}
                            label="Xác nhận mật khẩu"
                            type={InputType.PASSWORD}
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                </HorizontalList>

                <AdminButton size={ButtonSize.LARGE} onClick={saveHandler} style={{ margin: '20px' }}>
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    );
};

export default AdminCustomersCreatePage;
