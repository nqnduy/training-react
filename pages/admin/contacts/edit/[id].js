import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Select, Tabs } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import Section from '@/diginext/containers/Section';
import { Input, InputSelect, ValidationType, TextArea } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, checkPermission } from '@/helpers/helpers';
import { withAuth } from 'plugins/next-auth/admin';
import ApiCall from 'modules/ApiCall';

const AdminContactsEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const [slideId, setSlideId] = useState(router.query['slideId'] || '');
    const { id } = router.query;
    //Permissions
    const canEdit = checkPermission(user, 'contact_edit');
    const canDetail = checkPermission(user, 'contact_detail');

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
            path: `/api/v1/admin/contacts/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let formInput = res.data;
        setFormInput(formInput);
    };

    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let msgs = [];
        let currentFormInput = {
            fullName: formInputRef.current.fullName.value,
            email: formInputRef.current.email.value,
            phone: formInputRef.current.phone.value,
            address: formInputRef.current.address.value,
            message: formInputRef.current.message.value,
            status: formInputRef.current.status.value.value,
        };

        if (msgs.length) {
            return showMessages(msgs);
        }

        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/contacts/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push(`/admin/contacts`);
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const header = (
        <PageHeader pretitle="admin" title="Contract" button={<BackButton />} separator={true}>
            Update
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.fullName = el)}
                            defaultValue={formInput.fullName}
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

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.phone = el)}
                            defaultValue={formInput.phone}
                            label="Phone"
                            placeholder="Phone"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.address = el)}
                            defaultValue={formInput.address}
                            label="Address"
                            placeholder="Address"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                </HorizontalList>

                {formInput.status ? (
                    <HorizontalList>
                        <ListItem style={{ marginRight: '1rem', width: '50%' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.status = el)}
                                label={<label style={{ display: 'inline-block' }}>Status</label>}
                                labelInValue
                                defaultValue={{ value: formInput.status, label: formInput.statusText }}
                            >
                                <Select.Option value={1}>New</Select.Option>
                                <Select.Option value={2}>Watched</Select.Option>
                                <Select.Option value={3}>Resolved</Select.Option>
                            </InputSelect>
                        </ListItem>
                    </HorizontalList>
                ) : (
                    ''
                )}

                <HorizontalList itemSize="stretch">
                    <ListItem>
                        <TextArea
                            ref={(el) => (formInputRef.current.message = el)}
                            defaultValue={formInput.message}
                            label="Message"
                            placeholder="Message"
                            maxLength="10000"
                            height="200px"
                        />
                    </ListItem>
                </HorizontalList>

                {canEdit ? (
                    <AdminButton size={ButtonSize.LARGE} onClick={saveHandler} style={{ margin: '20px' }}>
                        Save changes
                    </AdminButton>
                ) : (
                    ''
                )}
            </Section>
        </LayoutPage>
    );
};

export default withAuth(AdminContactsEditPage);
