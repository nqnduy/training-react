import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Select, Tabs, Divider, Switch } from 'antd';
//
import BackButton from 'components/admin/BackButton';
import LayoutPage from 'components/admin/LayoutPage';
import SeoCollapse from 'components/admin/SeoCollapse';
import Section from '@/diginext/containers/Section';
import AdminButton, { ButtonSize } from '@/dashkit/Buttons';
import { HorizontalList, ListItem, ListItemSize } from '@/diginext/layout/ListLayout';
import { Input, ValidationType, TextArea, InputSelect } from '@/diginext/form/Form';
import PageHeader from '@/dashkit/PageHeader';
import ApiCall from 'modules/ApiCall';
import {
    showError,
    showSuccess,
    getFileNameFromPath,
    checkPermission,
    showNotifications,
    strToSlug,
    trackingContentRef,
    isFile,
} from '@/helpers/helpers';
import { locales, defaultLocale } from '@/constants/locale';
import { getObjectTrans } from '@/helpers/translation';
//sections
import SectionDefault1 from '@/website/section/postCategory/default/section1';
import SectionDefault2 from '@/website/section/postCategory/default/section2';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import SingleImage from '@/diginext/upload/singleImage';
const { Option } = Select;
const { TabPane } = Tabs;

export const getServerSideProps = TrackingUserSession;

const AdminPostCategoriesCreatePage = ({ user }) => {
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
    const canCreate = checkPermission(user, 'post_category_add');

    // Components
    const pageSectionComponents = {
        DEFAULT: {
            1: SectionDefault1,
            2: SectionDefault2,
        },
    };

    const pageSectionOptions = {
        DEFAULT: ['Section 1', 'Section 2'],
    };

    //Init load
    useEffect(function () {
        if (!canCreate) {
            router.push('/admin');
        } else {
            // push content section
            let components = {};
            let sort = {};
            let count = {};
            Object.keys(locales).forEach(function (locale) {
                components[locale] = [];
                sort[locale] = [];
                count[locale] = 0;
            });
            setCountSectionRef(count);
            setSortSection(sort);
            setSectionComponents(components);
        }
    }, []);

    // methods

    // save
    const saveHandler = function () {
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
            sortOrder: formInputRef.current.sortOrder.value,
            active: formInput.active || false,
            name: {
                vi: formInputRef.current['name_vi'].value,
                en: formInputRef.current['name_en'].value,
            },
            title: {
                vi: formInputRef.current['title_vi'].value,
                en: formInputRef.current['title_en'].value,
            },
            slug: {
                vi: formInputRef.current['slug_vi'].value,
                en: formInputRef.current['slug_en'].value,
            },
            shortDescription: {
                vi: formInputRef.current['shortDescription_vi'].value,
                en: formInputRef.current['shortDescription_en'].value,
            },
            metaImage: {
                vi: formInput.metaImagevi,
                en: formInput.metaImageen,
            },
            metaTitle: {
                vi: formInputRef.current['metaTitle_vi'].value,
                en: formInputRef.current['metaTitle_en'].value,
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
            showMessages(msgs);
            return;
        }

        Object.keys(locales).forEach(function (locale) {
            if (formInput[`metaImage${locale}`] && isFile(formInput[`metaImage${locale}`])) {
                currentFormInput['metaImage'][locale] = formInput[`metaImage${locale}`];
            } else {
                currentFormInput['metaImage'][locale] = getFileNameFromPath(formInput[`metaImage${locale}`] || '');
            }
        });

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function () {
            ApiCall({
                router,
                path: `/api/v1/admin/post-categories`,
                token: user.token,
                method: 'POST',
                data: currentFormInput,
                contentType: 1,
            }).then((res) => {
                if (res.status) {
                    let formInput = res.data;
                    Object.keys(locales).forEach(function (locale) {
                        if (formInput.metaImage && typeof formInput.metaImage[locale] != 'undefined') {
                            formInput[`metaImage${locale}Url`] = formInput.metaImage[locale];
                            formInput[`metaImage${locale}`] = getFileNameFromPath(formInput.metaImage[locale]);
                        }
                    });
                    setFormInput({
                        ...formInput,
                    });
                    showSuccess(res);
                    router.push('/admin/news/categories');
                } else {
                    showError(res);
                }
            });
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
            if (!section || !section.value || !pageSectionComponents['DEFAULT']) return;
            section = section.value;
            const PageSection = pageSectionComponents['DEFAULT'][section];
            components[locale].push({
                indexRef: countSectionRef[locale],
                component: PageSection,
                content: {},
            });
            sort[locale].push(countSectionRef[locale]);
            countRef[locale]++;
        } else {
            // child trigger insert or remove
            const PageSection = pageSectionComponents['DEFAULT'][section];
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
        <PageHeader pretitle="admin" title="Category" button={<BackButton />} separator={true}>
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
                                                  validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Bắt buộc' }]}
                                              />
                                          </ListItem>
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
                                          <ListItem>
                                              <TextArea
                                                  ref={(el) => (formInputRef.current[`shortDescription_${locale}`] = el)}
                                                  defaultValue={getObjectTrans(formInput.shortDescription, locale)}
                                                  label="Short Description"
                                                  placeholder="Short Description"
                                                  maxLength="10000"
                                                  height="100px"
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
                                                  {'DEFAULT' && pageSectionOptions['DEFAULT']
                                                      ? pageSectionOptions['DEFAULT'].map(function (name, index) {
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
                                                            locale={locale}
                                                            sectionOptions={pageSectionOptions['DEFAULT']}
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

                <AdminButton size={ButtonSize.LARGE} onClick={saveHandler} style={{ margin: '20px' }}>
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    );
};

export default AdminPostCategoriesCreatePage;
