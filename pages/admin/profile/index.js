import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Divider } from 'antd';
//
import LayoutPage from 'components/admin/LayoutPage';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import Section from '@/diginext/containers/Section';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { Input, InputType, ValidationType } from '@/diginext/form/Form';
import SingleImage from '@/diginext/upload/singleImage';
import { showSuccess, showError, showMessages, postGetForm, preSaveForm } from '@/helpers/helpers';
import { withAuth } from 'plugins/next-auth/admin';
import ApiCall from 'modules/ApiCall';

const AdminProfilePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();

    //Init load
    useEffect(function () {
        fetchDetail();
    }, []);

    // methods
    const fetchDetail = async function () {
        let params = {
            router,
            path: `/api/v1/auth/users/profiles`,
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
        let msgs = [];
        let currentPassword = formInputRef.current.currentPassword.value;
        let newPassword = formInputRef.current.newPassword.value;
        let confirmNewPassword = formInputRef.current.confirmNewPassword.value;

        let currentFormInput = {
            name: formInputRef.current.name.value,
            email: formInputRef.current.email.value,
        };

        if (newPassword && !currentPassword) {
            msgs.push('Please input current password.');
        }

        if (newPassword && newPassword != confirmNewPassword) {
            msgs.push('The new password confirmation does not match.');
        }

        if (msgs.length) {
            showMessages(msgs);
            return;
        }

        if (newPassword) {
            currentFormInput.password = newPassword;
            currentFormInput.currentPassword = currentPassword;
        }
        preSaveForm(formInput, currentFormInput, ['profileImage']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/auth/users/profiles`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            let formInput = res.data;
            showSuccess(res);
            postGetForm(formInput, ['profileImage']);
            setFormInput(formInput);
            formInputRef.current.currentPassword.value = '';
            formInputRef.current.newPassword.value = '';
            formInputRef.current.confirmNewPassword.value = '';
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
        <PageHeader pretitle="admin" title="Profile" separator={true}>
            Update
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <label style={{ marginBottom: '15px' }}>Profile Image</label>
                <HorizontalList style={{ width: '50%' }}>
                    <SingleImage name={'profileImage'} imageUrl={formInput.profileImageUrl} handleChange={handleChangeSingleUpload} />
                </HorizontalList>

                <Divider orientation="left">Informations</Divider>

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.name = el)}
                            defaultValue={formInput.name}
                            label="Name"
                            placeholder="Your name"
                            minLength="6"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <ListItem>
                        <Input
                            ref={(el) => (formInputRef.current.email = el)}
                            defaultValue={formInput.email}
                            label="Email"
                            placeholder="Your email"
                            minLength="6"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.EMAIL, errMessage: 'Không đúng định dạng email' }]}
                        />
                    </ListItem>
                </HorizontalList>

                {/* Password */}
                <Divider orientation="left">Password</Divider>
                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input ref={(el) => (formInputRef.current.currentPassword = el)} label="Current Password" type={InputType.PASSWORD} />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.newPassword = el)}
                            label="New Password"
                            type={InputType.PASSWORD}
                            minLength="6"
                            maxLength="255"
                        />
                    </ListItem>
                    <ListItem>
                        <Input
                            ref={(el) => (formInputRef.current.confirmNewPassword = el)}
                            label="Confirm new password"
                            type={InputType.PASSWORD}
                            minLength="6"
                            maxLength="255"
                        />
                    </ListItem>
                </HorizontalList>
                <AdminButton onClick={saveHandler} size={ButtonSize.LARGE}>
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    );
};

export default withAuth(AdminProfilePage);
