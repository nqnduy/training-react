import { Collapse } from 'antd';
import { HorizontalList, ListItem } from '@/diginext/layout/ListLayout';
import { Input, TextArea } from '@/diginext/form/Form';
import { getObjectTrans } from '@/helpers/translation';
import SingleImage from '@/diginext/upload/singleImage';
const { Panel } = Collapse;

const SeoCollapse = ({ formInputRef, formInput, locale }) => {
    const handleChangeSingleUpload = function (type, data) {
        setFormInput({
            ...formInput,
            ...data,
        });
    };

    return (
        <Collapse>
            <Panel header={'SEO'} key={`SEO`} forceRender={true}>
                <HorizontalList style={{ width: '50%' }}>
                    <SingleImage name={`metaImage${locale}`} imageUrl={formInput[`metaImage${locale}Url`]} handleChange={handleChangeSingleUpload} />
                </HorizontalList>
                <HorizontalList itemSize="stretch">
                    <ListItem>
                        <Input
                            ref={(el) => (formInputRef.current[`metaTitle_${locale}`] = el)}
                            defaultValue={getObjectTrans(formInput.metaTitle, locale)}
                            label="Meta Title"
                            placeholder="Meta Title"
                            maxLength="255"
                        />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize="stretch">
                    <ListItem>
                        <TextArea
                            ref={(el) => (formInputRef.current[`metaKeyword_${locale}`] = el)}
                            defaultValue={getObjectTrans(formInput.metaKeyword, locale)}
                            label="Meta Keyword"
                            placeholder="Meta Keyword"
                            maxLength="1000"
                            height="100px"
                        />
                    </ListItem>
                </HorizontalList>
                <HorizontalList itemSize="stretch">
                    <ListItem>
                        <TextArea
                            ref={(el) => (formInputRef.current[`metaDescription_${locale}`] = el)}
                            defaultValue={getObjectTrans(formInput.metaDescription, locale)}
                            label="Meta Description"
                            placeholder="Meta Description"
                            maxLength="1000"
                            height="100px"
                        />
                    </ListItem>
                </HorizontalList>
            </Panel>
        </Collapse>
    );
};

export default SeoCollapse;
