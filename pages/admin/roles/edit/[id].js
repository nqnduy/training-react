import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Switch, Collapse } from 'antd';
import { useRouter } from 'next/router';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import Section from '@/diginext/containers/Section';
import { Input, ValidationType } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showSuccess, showError, checkPermission } from '@/helpers/helpers';
import { withAuth } from 'plugins/next-auth/admin';
import ApiCall from 'modules/ApiCall';
const { Panel } = Collapse;

const AdminRolesEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [permissions, setPermissions] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const { id } = router.query;

    //Permissions
    const canEdit = checkPermission(user, 'role_edit');
    const canDetail = checkPermission(user, 'role_detail');

    //Init load
    useEffect(function () {
        if (!canDetail) {
            router.push('/admin');
        } else {
            fetchPermission();
            fetchDetail();
        }
    }, []);

    // methods
    const fetchDetail = async function () {
        let params = {
            router,
            path: `/api/v1/admin/roles/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        setFormInput(res.data);
    };

    const fetchPermission = async function () {
        let params = {
            router,
            path: `/api/v1/admin/permissions`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setPermissions(res.data || []);
    };

    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let currentFormInput = {
            name: formInputRef.current.name.value,
            isAdmin: formInput.isAdmin || false,
            permissions: formInput.permissions || {},
        };

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/roles/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/roles');
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const header = (
        <PageHeader pretitle="admin" title="Role" button={<BackButton />} separator={true}>
            Update
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
                            style={{ width: '50%' }}
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize="stretch">
                    <ListItem style={{ marginRight: '1rem' }}>
                        <div className="form-group">
                            <label style={{ marginRight: '15px' }}>isAdmin</label>
                            <Switch
                                checked={formInput.isAdmin}
                                onChange={() => {
                                    setFormInput({
                                        ...formInput,
                                        isAdmin: !formInput.isAdmin,
                                    });
                                }}
                            />
                        </div>
                    </ListItem>
                </HorizontalList>
            </Section>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <h3 style={{ marginBottom: '15px' }}>Permissions </h3>
                {permissions
                    ? Object.keys(permissions).map((index) => {
                          return (
                              <Collapse key={index}>
                                  <Panel header={permissions[index]['group']} key={index}>
                                      {Object.keys(permissions[index]['items']).map(function (indexPermission) {
                                          return (
                                              <React.Fragment key={indexPermission}>
                                                  <Checkbox
                                                      checked={
                                                          ((formInput.permissions && formInput.permissions[indexPermission]) || 0) == 1 ? true : false
                                                      }
                                                      onChange={(e) => {
                                                          let permissions = formInput.permissions || {};
                                                          if (e.target.checked) {
                                                              permissions[indexPermission] = 1;
                                                              setFormInput({
                                                                  ...formInput,
                                                                  permissions,
                                                              });
                                                          } else {
                                                              delete permissions[indexPermission];
                                                              setFormInput({
                                                                  ...formInput,
                                                                  permissions,
                                                              });
                                                          }
                                                      }}
                                                      value={indexPermission}
                                                  >
                                                      {permissions[index]['items'][indexPermission]}
                                                  </Checkbox>
                                                  <br />
                                              </React.Fragment>
                                          );
                                      })}
                                  </Panel>
                              </Collapse>
                          );
                      })
                    : ''}

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

export default withAuth(AdminRolesEditPage);
