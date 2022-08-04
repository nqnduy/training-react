import React, { useEffect, useRef, useState } from 'react';
import { Select, Tabs, Divider } from 'antd';
import { useRouter } from 'next/router';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import SeoCollapse from 'components/admin/SeoCollapse';
import PageHeader from '@/dashkit/PageHeader';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import Section from '@/diginext/containers/Section';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { Input, ValidationType, TextArea, InputSelect } from '@/diginext/form/Form';
import SingleImage from '@/diginext/upload/singleImage';
import {
    showError,
    showSuccess,
    getFileNameFromPath,
    checkPermission,
    trackingContentRef,
    isFile,
    postGetForm,
    preSaveForm,
} from '@/helpers/helpers';
import { locales, defaultLocale } from '@/constants/locale';
import { getObjectTrans } from '@/helpers/translation';
//sections
import SectionAbout1 from '@/components/website/section/page/about/section1';
import SectionAbout2 from '@/components/website/section/page/about/section2';
import SectionAbout3 from '@/components/website/section/page/about/section3';
import SectionRecruitment1 from '@/components/website/section/page/recruitment/section1';
import SectionRecruitment2 from '@/components/website/section/page/recruitment/section2';
//
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import ApiCall from 'modules/ApiCall';
const { Option } = Select;
const { TabPane } = Tabs;

export const getServerSideProps = TrackingUserSession;

const AdminPagesEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const { id } = router.query;
    //
    const [contentImgs, setContentImgs] = useState([]);
    const [contentRmImgs, setContentRmImgs] = useState([]);
    const [sectionComponents, setSectionComponents] = useState([]);
    const [sortSection, setSortSection] = useState([]);
    const [countSectionRef, setCountSectionRef] = useState(0);

    //Permissions
    const canEdit = checkPermission(user, 'page_edit');
    const canDetail = checkPermission(user, 'page_detail');

    // Components
    const pageSectionComponents = {
        ABOUT: {
            1: SectionAbout1,
            2: SectionAbout2,
            3: SectionAbout3,
        },
        RECRUITMENT: {
            1: SectionRecruitment1,
            2: SectionRecruitment2,
        },
    };

    const pageSectionOptions = {
        ABOUT: ['Section 1', 'Section 2', 'Section 3'],
        RECRUITMENT: ['Section 1', 'Section 2'],
    };

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
            path: `/api/v1/admin/pages/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        let formInput = res.data;
        postGetForm(formInput, ['metaImage']);
        setFormInput(formInput);
        // push content section
        let components = {};
        let sort = {};
        let count = {};
        Object.keys(locales).forEach(function (locale) {
            if (formInput.content[locale]) {
                let sectionComponents = [];
                let sortSection = [];
                let countSectionRef = 0;
                formInput.content[locale].forEach(function (section, indexRef) {
                    if (pageSectionComponents[formInput.code]) {
                        sectionComponents.push({
                            indexRef,
                            component: pageSectionComponents[formInput.code][section.section],
                            content: section,
                        });
                        countSectionRef++;
                        sortSection.push(indexRef);
                    }
                });
                components[locale] = sectionComponents;
                sort[locale] = sortSection;
                count[locale] = countSectionRef;
            }
        });
        setCountSectionRef(count);
        setSortSection(sort);
        setSectionComponents(components);
    };

    // save
    const saveHandler = function () {
        if (!canEdit) return;
        let msgs = [];
        let currentContentImgs = {};
        // remove link bas64
        Object.keys(contentImgs).forEach(function (key) {
            let isLink = key.substr(key.length - 3);
            if (isLink != 'Url') {
                currentContentImgs[key] = contentImgs[key];
            }
        });

        let currentContentRmImgs = [];
        // remove link bas64
        Object.keys(contentRmImgs).forEach(function (key) {
            let isLink = key.substr(key.length - 3);
            if (isLink != 'Url') {
                currentContentRmImgs.push(contentRmImgs[key]);
            }
        });

        let currentFormInput = {
            name: {
                vi: formInputRef.current['name_vi'].value,
                en: formInputRef.current['name_en'].value,
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
            content: {
                vi: trackingContentRef(formInputRef.current, null, sortSection['vi'], currentContentImgs, currentContentRmImgs, 'content_vi'),
                en: trackingContentRef(formInputRef.current, null, sortSection['en'], currentContentImgs, currentContentRmImgs, 'content_en'),
            },
            contentImgs: currentContentImgs,
            contentRmImgs: currentContentRmImgs,
        };

        if (msgs.length) {
            return showMessages(msgs);
        }

        preSaveForm(formInput, currentFormInput, ['metaImage']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            let params = {
                router,
                path: `/api/v1/admin/pages/${id}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1,
            };
            let res = await ApiCall(params);
            if (!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/pages');
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

    // Process Section
    const handleChangeSingleUploadContent = function (type, data, isDelete = false) {
        if (isDelete) {
            setContentRmImgs({
                ...contentRmImgs,
                ...data,
            });
            Object.keys(data).forEach(function (index) {
                data[index] = '';
                setContentImgs({
                    ...contentImgs,
                    ...data,
                });
            });
        } else {
            let rmImgs = {};
            setContentImgs({
                ...contentImgs,
                ...data,
            });
            Object.keys(data).forEach(function (index) {
                if (isFile(data[index])) {
                    rmImgs[index] = index;
                }
            });
            setContentRmImgs({
                ...contentRmImgs,
                ...rmImgs,
            });
        }
    };

    const updateSection = function (locale, section = null, index = null, isDelete = false) {
        let components = sectionComponents;
        let sort = sortSection;
        let countRef = countSectionRef;
        let rmImgs = [];
        if (isDelete) {
            let contentOfDelete = components[locale][index].content || null;
            if (contentOfDelete) {
                Object.keys(contentOfDelete).forEach(function (field) {
                    if ((field.includes('image') || field.includes('banner')) && contentOfDelete[field]) {
                        rmImgs.push(getFileNameFromPath(contentOfDelete[field]));
                    }
                });
            }
            delete components[locale][index];
            sort[locale].filter(function (value, key) {
                if (key != index) {
                    return value;
                }
            });
        } else if (section == null) {
            // parent trigger add
            let section = formInputRef.current[`section_${locale}`].value;
            if (!section || !section.value || !pageSectionComponents[formInput.code]) return;
            section = section.value;
            const PageSection = pageSectionComponents[formInput.code][section];
            components[locale].push({
                indexRef: countSectionRef[locale],
                component: PageSection,
                content: {},
            });
            sort[locale].push(countSectionRef[locale]);
            countRef[locale]++;
        } else {
            // child trigger insert or remove
            const PageSection = pageSectionComponents[formInput.code][section];
            components[locale].splice(index + 1, 0, {
                indexRef: countRef[locale],
                component: PageSection,
                content: {},
            });
            sort[locale].splice(index + 1, 0, countRef[locale]);
            countRef[locale]++;
        }
        setSectionComponents({ ...components });
        setSortSection({ ...sort });
        setCountSectionRef({ ...countRef });
        setContentRmImgs({
            ...contentRmImgs,
            ...rmImgs,
        });
    };

    const header = (
        <PageHeader pretitle="admin" title="Page" button={<BackButton />} separator={true}>
            Update
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: '2rem 0' }}>
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
                                                  validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                                              />
                                          </ListItem>
                                      </HorizontalList>

                                      <SeoCollapse formInputRef={formInputRef} formInput={formInput} locale={locale} />

                                      {/* Content */}
                                      <Divider orientation="left">Page Content</Divider>
                                      <HorizontalList>
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <InputSelect
                                                  ref={(el) => (formInputRef.current[`section_${locale}`] = el)}
                                                  label={
                                                      <label style={{ display: 'inline-block' }}>
                                                          Add Section <span style={{ color: 'red' }}>*</span>
                                                      </label>
                                                  }
                                                  labelInValue
                                                  defaultValue={{ value: 1 }}
                                              >
                                                  {formInput.code && pageSectionOptions[formInput.code]
                                                      ? pageSectionOptions[formInput.code].map(function (name, index) {
                                                            return (
                                                                <Select.Option key={`SectionBox${index}`} value={index + 1}>
                                                                    {name}
                                                                </Select.Option>
                                                            );
                                                        })
                                                      : ''}
                                              </InputSelect>
                                          </ListItem>
                                          <ListItem style={{ marginRight: '1rem' }}>
                                              <AdminButton size={ButtonSize.NORMAL} onClick={(e) => updateSection(locale)} style={{ margin: '25px' }}>
                                                  Add
                                              </AdminButton>
                                          </ListItem>
                                      </HorizontalList>
                                      {sectionComponents[locale]
                                          ? sectionComponents[locale].map(function (PageSection, index) {
                                                if (PageSection) {
                                                    let PageSectionComponent = PageSection.component;
                                                    return PageSectionComponent ? (
                                                        <PageSectionComponent
                                                            key={`pageContent_${locale}${PageSection.indexRef}`}
                                                            user={user}
                                                            locale={locale}
                                                            sectionOptions={pageSectionOptions[formInput.code]}
                                                            index={index}
                                                            indexRef={PageSection.indexRef}
                                                            content={PageSection.content}
                                                            formInputRef={formInputRef}
                                                            contentImgs={contentImgs}
                                                            contentRmImgs={contentRmImgs}
                                                            handleChangeSingleUploadContent={handleChangeSingleUploadContent}
                                                            updateSection={updateSection}
                                                        />
                                                    ) : (
                                                        ''
                                                    );
                                                }
                                            })
                                          : ''}
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

export default AdminPagesEditPage;
