import React, { useEffect, useRef, useState } from 'react';
import { Switch, Divider, Select } from 'antd';
import { useRouter } from 'next/router';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import Section from '@/diginext/containers/Section';
import { Input, ValidationType, InputType, InputSelect } from '@/diginext/form/Form';
import SingleImage from '@/diginext/upload/singleImage';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, checkPermission, postGetForm, preSaveForm } from '@/helpers/helpers';
import { withAuth } from 'plugins/next-auth/admin';
import ApiCall from 'modules/ApiCall';

const AdminUsersCreatePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [roles, setRoles] = useState({});
    const [myTimeout, setMyTimeout] = useState();

    //Permissions
    const canCreate = checkPermission(user, 'user_add');
    const canRoleList = checkPermission(user, 'role_list');

    //Init load
    useEffect(function () {
        if (!canCreate || !canRoleList) {
            router.push('/admin');
        } else {
            fetchRoles();
        }
    }, []);

    // methods
    const fetchRoles = async function () {
        let params = {
            router,
            path: `/api/v1/admin/roles?selects=id,name&get=true`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setRoles(res.data || []);
    };

    // save
    const saveHandler = function () {
        let msgs = [];
        let newPassword = formInputRef.current.newPassword.value;
        let confirmNewPassword = formInputRef.current.confirmNewPassword.value;
        let role = formInputRef.current.role.value;

        let currentFormInput = {
            name: formInputRef.current.name.value,
            email: formInputRef.current.email.value,
            active: formInput.active || false,
        };

        if (!role) {
            msgs.push('The role is required.');
        }

        if (!newPassword) {
            msgs.push('The new password is required.');
        }

        if (newPassword != confirmNewPassword) {
            msgs.push('The new password confirmation does not match.');
        }

        if (msgs.length) {
            return showMessages(msgs);
        }

        currentFormInput.password = newPassword;
        currentFormInput.role = role.value;

        preSaveForm(formInput, currentFormInput, ['profileImage']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/users`,
                token: user.token,
                method: 'POST',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/users');
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
        <PageHeader pretitle="admin" title="User" button={<BackButton />} separator={true}>
            Create
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <label style={{ marginBottom: '15px' }}>Profile Image</label>
                <HorizontalList style={{ width: '50%' }}>
                    <SingleImage name={'profileImage'} imageUrl={formInput.profileImageUrl} handleChange={handleChangeSingleUpload} />
                </HorizontalList>

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.name = el)}
                            defaultValue={formInput.name}
                            label="Name"
                            placeholder="Name"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.email = el)}
                            defaultValue={formInput.email}
                            label="Email"
                            placeholder="Email"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.EMAIL, errMessage: 'Không đúng định dạng email' }]}
                        />
                    </ListItem>
                </HorizontalList>

                {roles[0] ? (
                    <HorizontalList itemSize="stretch">
                        <ListItem style={{ marginRight: '1rem' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.role = el)}
                                label={
                                    <label style={{ display: 'inline-block' }}>
                                        Role <span style={{ color: 'red' }}>*</span>
                                    </label>
                                }
                                labelInValue
                                style={{ width: '50%' }}
                                defaultValue={{ label: roles[0].name, value: roles[0].id }}
                                required
                            >
                                {Object.keys(roles).map(function (index) {
                                    return (
                                        <Select.Option key={roles[index].id} value={roles[index].id}>
                                            {roles[index].name}
                                        </Select.Option>
                                    );
                                })}
                            </InputSelect>
                        </ListItem>
                    </HorizontalList>
                ) : (
                    ''
                )}

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <div className="form-group">
                            <label style={{ marginRight: '15px' }}>Status</label>
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

                {/* Password */}
                <Divider orientation="left">Password</Divider>
                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.newPassword = el)}
                            label="New Password"
                            type={InputType.PASSWORD}
                            minLength="6"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <ListItem>
                        <Input
                            ref={(el) => (formInputRef.current.confirmNewPassword = el)}
                            label="Confirm new password"
                            type={InputType.PASSWORD}
                            minLength="6"
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

export default withAuth(AdminUsersCreatePage);
