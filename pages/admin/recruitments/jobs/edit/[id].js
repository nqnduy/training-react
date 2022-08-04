import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Switch, Tabs, Select, Divider } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import SeoCollapse from 'components/admin/SeoCollapse';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import PageHeader from '@/dashkit/PageHeader';
import { Input, ValidationType, InputSelect, TextArea } from '@/diginext/form/Form';
import Section from '@/diginext/containers/Section';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import SingleImage from '@/diginext/upload/singleImage';
import Editor from '@/diginext/editor/editor';
import { showMessages, showSuccess, showError, checkPermission, strToSlug, postGetForm, preSaveForm } from '@/helpers/helpers';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import { getObjectTrans } from '@/helpers/translation';
import { locales, defaultLocale } from '@/constants/locale';
import ApiCall from 'modules/ApiCall';
const { Option } = Select;
const { TabPane } = Tabs;

export const getServerSideProps = TrackingUserSession;

const AdminJobsEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const [contractList, setContractList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const { id } = router.query;

    //Permissions
    const canEdit = checkPermission(user, 'job_edit');
    const canDetail = checkPermission(user, 'job_detail');
    const canContractList = checkPermission(user, 'job_contract_list');
    const canDepartmentList = checkPermission(user, 'job_department_list');

    //Init load
    useEffect(function () {
        if (!canEdit) {
            router.push('/admin');
        } else {
            if (canContractList) fetchContractList();
            if (canDepartmentList) fetchDepartmentList();
            fetchDetail();
        }
    }, []);

    // methods
    const fetchDetail = async function () {
        let params = {
            router,
            path: `/api/v1/admin/jobs/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let formInput = res.data;
        postGetForm(formInput, ['banner', 'bannerMb', 'metaImage']);
        setFormInput(formInput);
    };

    const fetchContractList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/job-contracts?get=true&selects=id,name&orderBy=id&order=1`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setContractList(res.data || []);
    };

    const fetchDepartmentList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/job-departments?get=true&selects=id,name&orderBy=id&order=1`,
            token: user.token,
        };
        let res = await ApiCall(params);
        setDepartmentList(res.data || []);
    };

    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let msgs = [];
        let currentFormInput = {
            jobContract: formInputRef.current.jobContract.value.value,
            jobDepartment: formInputRef.current.jobDepartment.value.value,
            sortOrder: formInputRef.current.sortOrder.value,
            active: formInput.active || false,
            banner: {
                vi: formInput.bannervi,
                en: formInput.banneren,
            },
            bannerMb: {
                vi: formInput.bannerMbvi,
                en: formInput.bannerMben,
            },
            title: {
                vi: formInputRef.current['title_vi'].value,
                en: formInputRef.current['title_en'].value,
            },
            slug: {
                vi: formInputRef.current['slug_vi'].value,
                en: formInputRef.current['slug_en'].value,
            },
            content: {
                vi: formInputRef.current['content_vi'].editor.getData(),
                en: formInputRef.current['content_en'].editor.getData(),
            },
            location: {
                vi: formInputRef.current['location_vi'].value,
                en: formInputRef.current['location_en'].value,
            },
            metaTitle: {
                vi: formInputRef.current['metaTitle_vi'].value,
                en: formInputRef.current['metaTitle_en'].value,
            },
            metaImage: {
                vi: formInput.metaImagevi,
                en: formInput.metaImageen,
            },
            metaKeyword: {
                vi: formInputRef.current['metaKeyword_vi'].value,
                en: formInputRef.current['metaKeyword_en'].value,
            },
            metaDescription: {
                vi: formInputRef.current['metaDescription_vi'].value,
                en: formInputRef.current['metaDescription_en'].value,
            },
        };

        if (msgs.length) {
            return showMessages(msgs);
        }

        preSaveForm(formInput, currentFormInput, ['banner', 'bannerMb', 'metaImage']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/jobs/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/recruitments/jobs');
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
        <PageHeader pretitle="admin" title="Job" button={<BackButton />} separator={true}>
            Update
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
                {contractList.length && formInput.jobContract ? (
                    <HorizontalList itemSize="stretch">
                        <ListItem style={{ marginRight: '1rem' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.jobContract = el)}
                                label={
                                    <label style={{ display: 'inline-block' }}>
                                        Contract <span style={{ color: 'red' }}>*</span>
                                    </label>
                                }
                                labelInValue
                                defaultValue={{ value: formInput.jobContract || contractList[0].id }}
                                style={{ width: '50%' }}
                            >
                                {contractList.map(function (contract) {
                                    return (
                                        <Select.Option key={contract.id} value={contract.id}>
                                            {getObjectTrans(contract.name)}
                                        </Select.Option>
                                    );
                                })}
                            </InputSelect>
                        </ListItem>
                    </HorizontalList>
                ) : (
                    ''
                )}
                {departmentList.length && formInput.jobDepartment ? (
                    <HorizontalList itemSize="stretch">
                        <ListItem style={{ marginRight: '1rem' }}>
                            <InputSelect
                                ref={(el) => (formInputRef.current.jobDepartment = el)}
                                label={
                                    <label style={{ display: 'inline-block' }}>
                                        Department <span style={{ color: 'red' }}>*</span>
                                    </label>
                                }
                                labelInValue
                                defaultValue={{ value: formInput.jobDepartment || departmentList[0].id }}
                                style={{ width: '50%' }}
                            >
                                {departmentList.map(function (department) {
                                    return (
                                        <Select.Option key={department.id} value={department.id}>
                                            {getObjectTrans(department.name)}
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
                                      <HorizontalList style={{ width: '50%' }}>
                                          <SingleImage
                                              name={`banner${locale}`}
                                              imageUrl={formInput[`banner${locale}Url`]}
                                              handleChange={handleChangeSingleUpload}
                                          />
                                      </HorizontalList>
                                      <HorizontalList style={{ width: '50%' }}>
                                          <SingleImage
                                              name={`bannerMb${locale}`}
                                              imageUrl={formInput[`bannerMb${locale}Url`]}
                                              handleChange={handleChangeSingleUpload}
                                          />
                                      </HorizontalList>
                                      <HorizontalList itemSize="stretch">
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <Input
                                                  ref={(el) => (formInputRef.current[`title_${locale}`] = el)}
                                                  defaultValue={getObjectTrans(formInput.title, locale)}
                                                  label="Title"
                                                  placeholder="Title"
                                                  maxLength="255"
                                                  validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                                                  onChange={(title) => {
                                                      let currentSlug = strToSlug(title);
                                                      let slug = formInput.slug || {};
                                                      slug[locale] = currentSlug;
                                                      setFormInput({
                                                          ...formInput,
                                                          slug,
                                                      });
                                                  }}
                                              />
                                          </ListItem>
                                      </HorizontalList>
                                      <HorizontalList itemSize="stretch">
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <Input
                                                  ref={(el) => (formInputRef.current[`slug_${locale}`] = el)}
                                                  defaultValue={getObjectTrans(formInput.slug, locale)}
                                                  label="Slug"
                                                  placeholder="Slug"
                                                  maxLength="255"
                                                  validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                                              />
                                          </ListItem>
                                      </HorizontalList>
                                      <HorizontalList itemSize="stretch">
                                          <Editor
                                              refRoot={formInputRef}
                                              refName={`content_${locale}`}
                                              content={getObjectTrans(formInput.content, locale)}
                                              user={user}
                                          />
                                      </HorizontalList>
                                      <HorizontalList itemSize="stretch">
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <Input
                                                  ref={(el) => (formInputRef.current[`location_${locale}`] = el)}
                                                  defaultValue={getObjectTrans(formInput.location, locale)}
                                                  label="Location"
                                                  placeholder="Location"
                                                  maxLength="255"
                                                  validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                                              />
                                          </ListItem>
                                      </HorizontalList>
                                      <SeoCollapse formInputRef={formInputRef} formInput={formInput} locale={locale} />
                                  </TabPane>
                              );
                          })
                        : ''}
                </Tabs>

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

export default AdminJobsEditPage;
