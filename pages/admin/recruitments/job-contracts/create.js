import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch, Tabs } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import { Input, ValidationType } from '@/diginext/form/Form';
import Section from '@/diginext/containers/Section';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import ApiCall from 'modules/ApiCall';
import { showMessages, showSuccess, showError, checkPermission, showNotifications } from '@/helpers/helpers';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import { getObjectTrans } from '@/helpers/translation';
import { locales, defaultLocale } from '@/constants/locale';
const { TabPane } = Tabs;

export const getServerSideProps = TrackingUserSession;

const AdminJobContractsCreatePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();

    //Permissions
    const canCreate = checkPermission(user, 'job_contract_add');

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
            sortOrder: formInputRef.current.sortOrder.value,
            active: formInput.active || false,
            name: {
                vi: formInputRef.current['name_vi'].value,
                en: formInputRef.current['name_en'].value,
            },
        };

        if (msgs.length) {
            return showMessages(msgs);
        }

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/job-contracts`,
                token: user.token,
                method: 'POST',
                data: currentFormInput,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/recruitments/job-contracts');
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const header = (
        <PageHeader pretitle="admin" title="Contract" button={<BackButton />} separator={true}>
            Create
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
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

                <Tabs defaultActiveKey={defaultLocale}>
                    {Object.keys(locales)
                        ? Object.keys(locales).map(function (locale) {
                              return (
                                  <TabPane forceRender={true} tab={locales[locale]} key={locale}>
                                      <HorizontalList itemSize="stretch">
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <Input
                                                  ref={(el) => (formInputRef.current[`name_${locale}`] = el)}
                                                  defaultValue={getObjectTrans(formInput.name, locale)}
                                                  label="Name"
                                                  placeholder="Name"
                                                  maxLength="255"
                                              />
                                          </ListItem>
                                      </HorizontalList>
                                  </TabPane>
                              );
                          })
                        : ''}
                </Tabs>

                <AdminButton size={ButtonSize.LARGE} onClick={saveHandler} style={{ margin: '20px' }}>
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    );
};

export default AdminJobContractsCreatePage;
