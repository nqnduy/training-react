import React, { useEffect, useRef, useState } from 'react';
import { Tabs, Select } from 'antd';
import { useRouter } from 'next/router';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import Section from '@/diginext/containers/Section';
import { Input, ValidationType, InputSelect } from '@/diginext/form/Form';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import SingleFile from '@/diginext/upload/singleFile';
import { showMessages, showSuccess, showError, checkPermission, postGetForm, preSaveForm } from '@/helpers/helpers';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import { getObjectTrans } from '@/helpers/translation';
import { ApplicantStatusTrans, ApplicantStatus } from '@/constants/job';
import ApiCall from 'modules/ApiCall';
const { Option } = Select;
const { TabPane } = Tabs;

export const getServerSideProps = TrackingUserSession;

const AdminJobApplicantsEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const [jobList, setJobList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const { id } = router.query;

    //Permissions
    const canEdit = checkPermission(user, 'job_applicant_edit');
    const canDetail = checkPermission(user, 'job_applicant_detail');
    const canJobList = checkPermission(user, 'job_list');
    const canProvinceList = checkPermission(user, 'zone_province_list');

    //Init load
    useEffect(function () {
        if (!canDetail) {
            router.push('/admin');
        } else {
            if (canJobList) fetchJobList();
            if (canProvinceList) fetchProvinceList();
            fetchDetail();
        }
    }, []);

    // methods
    const fetchDetail = async function () {
        let params = {
            router,
            path: `/api/v1/admin/job-applicants/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let formInput = res.data;
        postGetForm(formInput, ['fileCv']);
        setFormInput(formInput);
    };

    const fetchJobList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/jobs?get=true&selects=id,title&orderBy=id&order=1`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setJobList(res.data || []);
    };

    const fetchProvinceList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/zone-provinces?get=true&selects=id,name&orderBy=id&order=1`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setProvinceList(res.data || []);
    };

    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let msgs = [];
        let currentFormInput = {
            job: formInputRef.current.job.value.value,
            zoneProvince: formInputRef.current.zoneProvince.value.value,
            status: formInputRef.current.status.value.value,
            name: formInputRef.current.name.value,
            email: formInputRef.current.email.value,
            phone: formInputRef.current.phone.value,
            address: formInputRef.current.address.value,
        };

        if (msgs.length) {
            showMessages(msgs);
            return;
        }

        preSaveForm(formInput, currentFormInput, ['fileCv']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/job-applicants/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/recruitments/job-applicants');
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
        <PageHeader pretitle="admin" title="Applicant" button={<BackButton />} separator={true}>
            Update
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                {jobList.length && formInput.job ? (
                    <HorizontalList itemSize="stretch">
                        <ListItem style={{ marginRight: '1rem' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.job = el)}
                                label={
                                    <label style={{ display: 'inline-block' }}>
                                        Job <span style={{ color: 'red' }}>*</span>
                                    </label>
                                }
                                labelInValue
                                defaultValue={{ value: formInput.job || jobList[0].id }}
                                style={{ width: '50%' }}
                            >
                                {jobList.map(function (job) {
                                    return (
                                        <Select.Option key={job.id} value={job.id}>
                                            {getObjectTrans(job.title)}
                                        </Select.Option>
                                    );
                                })}
                            </InputSelect>
                        </ListItem>
                    </HorizontalList>
                ) : (
                    ''
                )}
                {provinceList.length && formInput.zoneProvince ? (
                    <HorizontalList itemSize="stretch">
                        <ListItem style={{ marginRight: '1rem' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.zoneProvince = el)}
                                label={
                                    <label style={{ display: 'inline-block' }}>
                                        Province <span style={{ color: 'red' }}>*</span>
                                    </label>
                                }
                                labelInValue
                                defaultValue={{ value: formInput.zoneProvince || provinceList[0].id }}
                                style={{ width: '50%' }}
                            >
                                {provinceList.map(function (zoneProvince) {
                                    return (
                                        <Select.Option key={zoneProvince.id} value={zoneProvince.id}>
                                            {getObjectTrans(zoneProvince.name)}
                                        </Select.Option>
                                    );
                                })}
                            </InputSelect>
                        </ListItem>
                    </HorizontalList>
                ) : (
                    ''
                )}

                {formInput.status ? (
                    <HorizontalList itemSize="stretch">
                        <ListItem style={{ marginRight: '1rem' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.status = el)}
                                label={<label style={{ display: 'inline-block' }}>Status</label>}
                                defaultValue={{
                                    label: ApplicantStatusTrans()[formInput.status || ApplicantStatus.NEW],
                                    value: formInput.status || ApplicantStatus.NEW,
                                }}
                                labelInValue
                            >
                                {Object.keys(ApplicantStatusTrans()).map(function (status) {
                                    return (
                                        <Select.Option key={status} value={status}>
                                            {ApplicantStatusTrans()[status]}
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
                        <Input
                            ref={(el) => (formInputRef.current.name = el)}
                            defaultValue={formInput.name}
                            label="Name"
                            placeholder="Name"
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
                            validateConditions={[
                                { type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' },
                                { type: ValidationType.EMAIL, errMessage: 'Phải là email' },
                            ]}
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
                </HorizontalList>

                <HorizontalList itemSize="stretch">
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

                <HorizontalList style={{ width: '50%' }}>
                    <SingleFile name={`fileCv`} imageUrl={formInput[`fileCvUrl`]} handleChange={handleChangeSingleUpload} />
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

export default AdminJobApplicantsEditPage;
