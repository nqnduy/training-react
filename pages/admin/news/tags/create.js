import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch, Tabs } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import Section from '@/diginext/containers/Section';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import { Input, ValidationType } from '@/diginext/form/Form';
import ApiCall from 'modules/ApiCall';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, strToSlug, checkPermission, showNotifications } from '@/helpers/helpers';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';

export const getServerSideProps = TrackingUserSession;

const AdminTagsCreatePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();

    //Permissions
    const canCreate = checkPermission(user, 'tag_add');

    //Init load
    useEffect(function () {
        if (!canCreate) {
            router.push('/admin');
        }
    }, []);

    // methods

    // save
    const saveHandler = function () {
        let msgs = [];

        let currentFormInput = {
            name: formInputRef.current.name.value,
            slug: formInputRef.current.slug.value,
            sortOrder: formInputRef.current.sortOrder.value,
            active: formInput.active || false,
        };

        if (msgs.length) {
            showMessages(msgs);
            return;
        }

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/tags`,
                token: user.token,
                method: 'POST',
                data: currentFormInput,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/news/tags');
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const header = (
        <PageHeader pretitle="admin" title="Tag" button={<BackButton />} separator={true}>
            Create
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.name = el)}
                            defaultValue={formInput.name}
                            label="Name"
                            placeholder="Name"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                            onChange={(name) => {
                                let slug = strToSlug(name);
                                setFormInput({
                                    ...formInput,
                                    slug,
                                });
                            }}
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.slug = el)}
                            defaultValue={formInput.slug}
                            label="Slug"
                            placeholder="Slug"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                </HorizontalList>

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

                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.sortOrder = el)}
                            defaultValue={formInput.sortOrder}
                            label="Sort Order"
                            placeholder="0"
                            maxLength="255"
                            validateConditions={[
                                { type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' },
                                { type: ValidationType.NUMBERS, errMessage: 'Phải là số' },
                            ]}
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

export default AdminTagsCreatePage;
