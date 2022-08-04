import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch, Select, Tabs } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import Section from '@/diginext/containers/Section';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import { Input, ValidationType } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, checkPermission } from '@/helpers/helpers';
import ApiCall from 'modules/ApiCall';
import { locales, defaultLocale } from '@/constants/locale';
import { getObjectTrans } from '@/helpers/translation';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
export const getServerSideProps = TrackingUserSession;

const { TabPane } = Tabs;
const { Option } = Select;

const AdminWardCreatePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const { id } = router.query;
    //Const
    const [zoneDistrictData, SetZoneDistictData] = useState([]);
    const defaultLabelDistrict = 'District';
    const [districtValue, setDistrictValue] = React.useState(defaultLabelDistrict);
    const onchangeDistrict = (key) => {
        setDistrictValue(key);
    };
    //Permissions
    const canCreate = checkPermission(user, 'zone_ward_add');
    //Init load
    useEffect(function () {
        if (!canCreate) {
            router.push('/admin');
        } else {
            fetchListZoneDistrict();
        }
    }, []);

    // methods
    const fetchListZoneDistrict = async function () {
        let params = {
            router,
            path: `/api/v1/admin/zone-districts?get=true`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let list = res.data;
        SetZoneDistictData(list);
    };
    // save
    const saveHandler = function () {
        let msgs = [];
        if (districtValue === defaultLabelDistrict) {
            let res = {
                status: false,
                message: 'District is required',
            };
            return showError(res);
        }
        let currentFormInput = {
            active: formInput.active || false,
            name: {
                vi: formInputRef.current['name_vi'].value,
                en: formInputRef.current['name_en'].value,
            },
            zoneDistrict: districtValue,
            code: formInputRef.current.code.value,
            sortOrder: formInputRef.current.sortOrder.value,
            lat: formInputRef.current.lat.value,
            lng: formInputRef.current.lng.value,
        };
        if (msgs.length) {
            return showMessages(msgs);
        }
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/zone-wards`,
                token: user.token,
                method: 'POST',
                data: currentFormInput,
                contentType: 2,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/zones/wards');
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
        <PageHeader pretitle="admin" title="Ward" button={<BackButton />} separator={true}>
            Create
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
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

                {zoneDistrictData && zoneDistrictData.length ? (
                    <HorizontalList itemSize={ListItemSize.STRETCH}>
                        <ListItem style={{ marginRight: '1rem', width: '50%' }}>
                            <label style={{ marginBottom: '15px' }}>District</label>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                value={districtValue}
                                onChange={onchangeDistrict}
                            >
                                {zoneDistrictData.map((district) => (
                                    <Option key={district.id} value={district.id}>
                                        {district.name.vi}
                                    </Option>
                                ))}
                            </Select>
                        </ListItem>
                    </HorizontalList>
                ) : (
                    ''
                )}

                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.code = el)}
                            defaultValue={formInput.code}
                            label="Code"
                            placeholder="code"
                            maxLength="255"
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.sortOrder = el)}
                            defaultValue={formInput.sortOrder}
                            label="Sort Order"
                            placeholder="Sort Order"
                            maxLength="255"
                            validateConditions={[
                                { type: ValidationType.NOT_EMPTY, errMessage: 'is required' },
                                { type: ValidationType.NUMBERS, errMessage: 'must be number' },
                            ]}
                        />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.lat = el)}
                            defaultValue={formInput.lat}
                            label="Latitude"
                            placeholder="latitude"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NUMBERS, errMessage: 'must be number' }]}
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.lng = el)}
                            defaultValue={formInput.lng}
                            label="Longitude"
                            placeholder="longitude"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NUMBERS, errMessage: 'must be number' }]}
                        />
                    </ListItem>
                </HorizontalList>

                <Tabs defaultActiveKey={defaultLocale}>
                    {Object.keys(locales)
                        ? Object.keys(locales).map(function (locale) {
                              return (
                                  <TabPane forceRender={true} tab={locales[locale]} key={locale}>
                                      <HorizontalList itemSize={ListItemSize.STRETCH}>
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <Input
                                                  ref={(el) => (formInputRef.current[`name_${locale}`] = el)}
                                                  defaultValue={getObjectTrans(formInput.name, locale)}
                                                  label="Name"
                                                  placeholder="Name"
                                                  maxLength="255"
                                                  validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'is required' }]}
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

export default AdminWardCreatePage;
