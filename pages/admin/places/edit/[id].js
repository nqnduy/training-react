import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch, Divider, Select, Collapse, Radio, icons } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import Section from '@/diginext/containers/Section';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import { Input, ValidationType, InputType } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { showMessages, showSuccess, showError, checkPermission, preSaveForm, postGetForm } from '@/helpers/helpers';
import ApiCall from 'modules/ApiCall';
import SingleImage from '@/diginext/upload/singleImage';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';

export const getServerSideProps = TrackingUserSession;

const AdminPlaceEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const { id } = router.query;
    const [listPlace, setListPlace] = useState([]);
    const [zoneProvinceData, SetZoneProvinceData] = useState([]);
    const [zoneDistrictData, SetZoneDistrictData] = useState([]);
    const [zoneWardData, SetZoneWardData] = useState([]);
    const [placeIdValue, setPlaceId] = useState('');
    const [displayListPlace, setDisplayListPlace] = useState(false);
    const defaultProvince = 'Tỉnh/Thành Phố';
    const defaultDistrict = 'Quận/Huyện';
    const defaultWard = 'Xã/Phường';
    //Const
    const [provinceValue, setProvinceValue] = React.useState(defaultProvince);
    const [arrayOpenTime, setArrayOpenTime] = React.useState([]);

    const onchangeProvince = (key, name) => {
        setProvinceValue(key);
        setDistrictValue(defaultDistrict);
        setWardValue(defaultWard);
        SetZoneWardData([]);
        fetchListZoneDistrict(key);
    };

    const [districtValue, setDistrictValue] = React.useState(defaultDistrict);
    const onchangeDistrict = (key, name) => {
        setDistrictValue(key);
        setWardValue(defaultWard);
        fetchListZoneWard(key);
    };

    const [wardValue, setWardValue] = React.useState(defaultWard);
    const onchangeWard = (key, name) => {
        setWardValue(key);
    };

    const onChangePlaceId = (e) => {
        let placeId = e.target.value;
        setPlaceId(e.target.value);
        const searchPlaceDetail = async function () {
            let params = {
                router,
                path: `/api/v1/frontend/places/find/detail-place?placeId=${placeId}`,
                token: user.token,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            let data = res.data;
            if (data) {
                formInputRef.current.name.value = data.name;
                formInputRef.current.phone.value = data.international_phone_number ? data.international_phone_number : '';
                formInputRef.current.rating.value = data.rating ? data.rating : '';
                formInputRef.current.fullAddress.value = data.formatted_address;
                formInputRef.current.lat.value = data.geometry.location.lat;
                formInputRef.current.lng.value = data.geometry.location.lng;
                setArrayOpenTime(res.data.opening_hours ? res.data.opening_hours.weekday_text : '');
            }
        };
        searchPlaceDetail();
    };

    const resetOpeningHours = function () {
        setArrayOpenTime([]);
    };

    const addItemOpenTime = function () {
        if (formInputRef.current.itemOpenTime.value !== '') {
            setArrayOpenTime([...arrayOpenTime, formInputRef.current.itemOpenTime.value]);
            formInputRef.current.itemOpenTime.value = '';
        }
    };

    const searchLatLng = function () {
        clearTimeout(myTimeout);
        let timeout = setTimeout(async function () {
            let address = encodeURI(formInputRef.current.fullAddress.value);
            let params = {
                router,
                path: `/api/v1/frontend/places/find/lat-lng?address=${address}`,
                token: user.token,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            let data = res.data;
            if (data) {
                (formInputRef.current.lat.value = data.geometry.location.lat), (formInputRef.current.lng.value = data.geometry.location.lng);
            }
        }, 1000);
        setMyTimeout(timeout);
    };

    const searchListPlace = function () {
        clearTimeout(myTimeout);
        let timeout = setTimeout(async function () {
            let name = encodeURI(formInputRef.current.name.value);
            let params = {
                router,
                path: `/api/v1/frontend/places/find/list-place?name=${name}`,
                token: user.token,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            let data = res.data;
            if (data) {
                formInputRef.current.phone.value = '';
                formInputRef.current.rating.value = '';
                formInputRef.current.fullAddress.value = '';
                formInputRef.current.lat.value = '';
                formInputRef.current.lng.value = '';
                setArrayOpenTime('');
                setListPlace(data);
                formInputRef.current.list.scrollIntoView();
                setDisplayListPlace(true);
            }
        }, 1000);
        setMyTimeout(timeout);
    };

    //Permissions
    const canDetail = checkPermission(user, 'place_detail');
    const canEdit = checkPermission(user, 'place_edit');

    //Init load
    useEffect(function () {
        if (!canDetail) {
            router.push('/admin');
        } else {
            fetchDetail();
            fetchListZoneProvince();
        }
    }, []);

    // methods
    const fetchDetail = async function () {
        let params = {
            router,
            path: `/api/v1/admin/places/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let formInput = res.data;
        setProvinceValue(res.data.zoneProvince ? res.data.zoneProvince : defaultProvince);
        setDistrictValue(res.data.zoneDistrict ? res.data.zoneDistrict : defaultDistrict);
        setWardValue(res.data.zoneWard ? res.data.zoneWard : defaultWard);
        setArrayOpenTime(res.data.openingHours ? res.data.openingHours : '');
        if (res.data.zoneProvince) {
            fetchListZoneDistrict(res.data.zoneProvince);
        }
        if (res.data.zoneDistrict) {
            fetchListZoneWard(res.data.zoneDistrict);
        }
        setFormInput(formInput);
        postGetForm(formInput, ['image']);
    };

    const fetchListZoneProvince = async function () {
        let params = {
            router,
            path: `/api/v1/zone-provinces?get=true`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let list = res.data;
        SetZoneProvinceData(list);
    };

    const fetchListZoneDistrict = async function (key) {
        let params = {
            router,
            path: `/api/v1/zone-districts?get=true&zoneProvince=${key}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let list = res.data;
        SetZoneDistrictData(list);
    };

    const fetchListZoneWard = async function (key) {
        let params = {
            router,
            path: `/api/v1/zone-wards?get=true&zoneDistrict=${key}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let list = res.data;
        SetZoneWardData(list);
    };
    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let msgs = [];
        let currentFormInput = {
            status: formInput.status || false,
            name: formInputRef.current.name.value,
            sortOrder: formInputRef.current.sortOrder.value,
            phone: formInputRef.current.phone.value,
            openingHours: arrayOpenTime,
            fullAddress: formInputRef.current.fullAddress.value,
        };
        if (formInputRef.current.rating.value !== '') {
            currentFormInput = {
                ...currentFormInput,
                rating: formInputRef.current.rating.value,
            };
        }
        if (formInputRef.current.lat.value !== '') {
            currentFormInput = {
                ...currentFormInput,
                lat: formInputRef.current.lat.value,
            };
        }
        if (formInputRef.current.lng.value !== '') {
            currentFormInput = {
                ...currentFormInput,
                lng: formInputRef.current.lng.value,
            };
        }
        if (provinceValue !== defaultProvince) {
            currentFormInput = {
                ...currentFormInput,
                zoneProvince: provinceValue,
            };
        }
        if (districtValue !== defaultDistrict) {
            currentFormInput = {
                ...currentFormInput,
                zoneDistrict: districtValue,
            };
        }
        if (wardValue !== defaultWard) {
            currentFormInput = {
                ...currentFormInput,
                zoneWard: wardValue,
            };
        }
        if (placeIdValue) {
            currentFormInput = {
                ...currentFormInput,
                placeId: placeIdValue,
            };
        }
        preSaveForm(formInput, currentFormInput, ['image']);

        if (msgs.length) {
            return showMessages(msgs);
        }
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/places/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/places');
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
        <PageHeader pretitle="admin" title="Place" button={<BackButton />} separator={true}>
            Edit
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                <HorizontalList style={{ width: '50%', marginTop: '5px' }}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <label>Place Image</label>
                        <br />
                        <div style={{ marginTop: '5px' }}></div>
                        <SingleImage name={'image'} imageUrl={formInput ? formInput.imageUrl : ''} handleChange={handleChangeSingleUpload} />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem', marginTop: '5px' }}>
                        <div className="form-group">
                            <label style={{ marginRight: '15px' }}>Status</label>
                            <Switch
                                checked={formInput.status}
                                onChange={() => {
                                    setFormInput({
                                        ...formInput,
                                        status: !formInput.status,
                                    });
                                }}
                            />
                        </div>
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.name = el)}
                            defaultValue={formInput.name}
                            label="Tên"
                            placeholder="tên"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <AdminButton size={ButtonSize.LARGE} onClick={searchListPlace} style={{ margin: '20px' }}>
                        Get Place List
                    </AdminButton>
                </HorizontalList>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.phone = el)}
                            defaultValue={formInput.phone}
                            label="Phone"
                            placeholder="số điện thoại"
                            maxLength="255"
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.sortOrder = el)}
                            defaultValue={formInput.sortOrder}
                            label="Sort Order"
                            placeholder="thứ tự sắp xếp"
                            maxLength="255"
                            validateConditions={[
                                { type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' },
                                { type: ValidationType.NUMBERS, errMessage: 'Phải là số' },
                            ]}
                        />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.rating = el)}
                            defaultValue={formInput.rating}
                            label="Rating"
                            placeholder="đánh giá"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NUMBERS, errMessage: 'Phải là số' }]}
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <label style={{ marginBottom: '15px' }}>Opening Hours</label>
                        <Select
                            placeholder="Thời gian làm việc"
                            dropdownRender={(menu) => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                        <Input style={{ flex: 'auto' }} ref={(el) => (formInputRef.current.itemOpenTime = el)} />
                                        <a style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }} onClick={addItemOpenTime}>
                                            Add item
                                        </a>
                                    </div>
                                </div>
                            )}
                        >
                            {arrayOpenTime ? arrayOpenTime.map((item, index) => <Option key={index}>{item}</Option>) : ''}
                        </Select>
                    </ListItem>
                    <AdminButton size={ButtonSize.LARGE} onClick={resetOpeningHours} style={{ margin: '20px' }}>
                        Reset Hour List
                    </AdminButton>
                </HorizontalList>
                <Divider orientation="left" style={{ marginTop: '30px' }}>
                    Address Informations
                </Divider>
                <label style={{ marginBottom: '15px' }}>Province</label>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem', width: '50%' }}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={provinceValue}
                            onChange={onchangeProvince}
                        >
                            {zoneProvinceData.map((province) => (
                                <Option key={province.id} name={province.name.vi}>
                                    {province.name.vi}
                                </Option>
                            ))}
                        </Select>
                    </ListItem>
                </HorizontalList>
                <br />
                <label style={{ marginBottom: '15px' }}>District</label>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem', width: '50%' }}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={onchangeDistrict}
                            value={districtValue}
                        >
                            {zoneDistrictData.map((district) => (
                                <Option key={district.id} value={district.id} name={district.name.vi}>
                                    {district.name.vi}
                                </Option>
                            ))}
                        </Select>
                    </ListItem>
                </HorizontalList>
                <br />
                <label style={{ marginBottom: '15px' }}>Ward</label>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem', width: '50%' }}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={onchangeWard}
                            value={wardValue}
                        >
                            {zoneWardData.map((ward) => (
                                <Option key={ward.id} value={ward.id} name={ward.name.vi}>
                                    {ward.name.vi}
                                </Option>
                            ))}
                        </Select>
                    </ListItem>
                </HorizontalList>
                <br />
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.fullAddress = el)}
                            defaultValue={formInput.fullAddress}
                            label="Full Address"
                            placeholder="Địa chỉ"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                        />
                    </ListItem>
                    <AdminButton size={ButtonSize.LARGE} onClick={searchLatLng} style={{ margin: '20px' }}>
                        Get Coordinate
                    </AdminButton>
                </HorizontalList>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.lat = el)}
                            defaultValue={formInput.lat}
                            label="Latitude"
                            placeholder="Vĩ độ trên map"
                            maxLength="255"
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: '1rem' }}>
                        <Input
                            ref={(el) => (formInputRef.current.lng = el)}
                            defaultValue={formInput.lng}
                            label="Longitude"
                            placeholder="Kinh độ trên map"
                            maxLength="255"
                        />
                    </ListItem>
                </HorizontalList>
                {displayListPlace === true ? (
                    <Divider orientation="left" style={{ marginTop: '30px' }}>
                        List Place
                    </Divider>
                ) : (
                    ''
                )}
                <div ref={(el) => (formInputRef.current.list = el)}></div>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <Radio.Group style={{ width: '1200px' }} onChange={onChangePlaceId}>
                        {listPlace
                            ? listPlace.map((place) => (
                                  <Collapse defaultActiveKey={['1']} key={place.place_id}>
                                      <Panel header={place.name} key={place.place_id}>
                                          <p>Name: {place.name}</p>
                                          <p>Full Address: {place.formatted_address}</p>
                                          <p>Rating: {place.rating}</p>
                                          <p>Place ID: {place.place_id}</p>
                                          <p>lat: {place.geometry.location.lat}</p>
                                          <p>lng: {place.geometry.location.lng}</p>
                                      </Panel>
                                      <Radio value={place.place_id}></Radio>
                                  </Collapse>
                              ))
                            : ''}
                    </Radio.Group>
                </HorizontalList>
                <AdminButton size={ButtonSize.LARGE} onClick={saveHandler} style={{ margin: '20px' }}>
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    );
};

export default AdminPlaceEditPage;
