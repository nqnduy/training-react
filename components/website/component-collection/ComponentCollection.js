import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Code from 'components/diginext/elements/Code';
import Button from 'components/diginext/button/Button';
import COMPONENT_LIST from './COMPONENT_LIST';
import ArrayExtra from 'plugins/utils/ArrayExtra';
import { VerticalList, VerticalListAlign } from 'components/diginext/layout/ListLayout';
import { Input } from 'antd';
import DashkitButton, { ButtonType } from 'components/dashkit/Buttons';

const STYLE = {
    bgColor: '#ccc',
    textColorActive: '#fff',
    textColor: '#000',
};

const ComponentCollection = (props) => {
    const [isInit, setisInit] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentChoosingTagIndex, setCurrentChoosingTagIndex] = useState([-1]);
    const [listShow, setListShow] = useState(COMPONENT_LIST);

    // init

    useEffect(() => {
        init();
        setupTags();

        filterByTagIndexArray(currentChoosingTagIndex);
        return () => {};
    }, []);

    useEffect(() => {
        if (currentChoosingTagIndex.length == 0) setCurrentChoosingTagIndex([-1]);
        filterByTagIndexArray();
        return () => {};
    }, [currentChoosingTagIndex]);

    const init = (params) => {
        if (isInit) return;
        setisInit(true);

        setNameSearch(getCurrentSearch());
    };

    const setupTags = (params) => {
        const list = COMPONENT_LIST.map((item) => {
            return item.tags;
        });
        const merged = [].concat.apply([], list);
        const unique = [...new Set(merged)];
        const sort = unique.sort();
        setTags(sort);
    };

    // handle tag

    const onClickTag = (index) => {
        const foundIndex = currentChoosingTagIndex.find((tagIndex) => tagIndex == index);
        if (typeof foundIndex == 'undefined') {
            addChoosingTagIndex(index);
        } else {
            removeChoosingTagIndex(index);
        }
    };

    const addChoosingTagIndex = (num) => {
        if (num != -1) {
            removeChoosingTagIndex(-1);
            setCurrentChoosingTagIndex([...currentChoosingTagIndex, num]);
        } else {
            setCurrentChoosingTagIndex([-1]);
        }
    };
    const removeChoosingTagIndex = (num) => {
        const list = ArrayExtra.removeItem(num, currentChoosingTagIndex);
        setCurrentChoosingTagIndex([...list]);
    };

    /**
     * @param {Array} indexArray
     */
    const filterByTagIndexArray = (indexArray) => {
        indexArray = indexArray || currentChoosingTagIndex;
        if (indexArray.findIndex((item) => item == -1) >= 0) {
            //all
            clearAllFilter();
        } else {
            const array = indexArray.map((index) => {
                return tags[index];
            });
            var result = COMPONENT_LIST.filter(function (item) {
                if (item) {
                    return ArrayExtra.allMatchInArray(item.tags, array);
                }
            });
            setListShow(result);
        }
    };

    const clearAllFilter = (params) => {
        // ('clearAllFilter')
        setListShow(COMPONENT_LIST);
    };

    ////
    // handle search

    const onChangeSearchInput = (params) => {
        // ('params :>> ', params.target.value);
        const value = params.target.value;
        setNameSearch(value);
    };

    const onChangeSearchByName = (value) => {
        setCurrentSearch(value);
        searchByName(value);
    };

    const searchByName = (value) => {
        value = value.trim();
        value = value.toUpperCase();

        const list = COMPONENT_LIST.filter((item) => {
            if (item) if (item.name) return item.name.toUpperCase().indexOf(value) >= 0;
        });
        setListShow(list);
    };

    const getCurrentSearch = () => {
        if (typeof window == 'undefined') return;

        return window.localStorage.getItem('currentSearch') || '';
    };

    const setCurrentSearch = (name) => {
        if (typeof window == 'undefined') return;

        window.localStorage.setItem('currentSearch', name);
    };

    const [nameSearch, setNameSearch] = useState('');

    useEffect(() => {
        if (nameSearch) onChangeSearchByName(nameSearch);
        else onChangeSearchByName('');
        return () => {};
    }, [nameSearch]);

    return (
        <>
            <style global jsx>{`
                html,
                body {
                    background-color: ${process.env.NEXT_PUBLIC_GLOBAL_DARK ? 'black' : 'none'};
                    color: ${process.env.NEXT_PUBLIC_GLOBAL_DARK ? 'white' : 'none'};
                }
                h2 {
                    color: ${process.env.NEXT_PUBLIC_GLOBAL_DARK ? 'white' : 'none'};
                }
            `}</style>
            <style jsx>{`
                .itemComponemt {
                    width: 100%;
                    height: 100%;
                    padding: 10px 0px 10px 0px;
                    display: flex;
                    flex-direction: column;
                }
                .core {
                    //background-color: gray;
                    margin: 5px 0px 5px 0px;
                }
            `}</style>
            <div className="tagsButton">
                <Button
                    {...STYLE}
                    active={currentChoosingTagIndex.find((item) => item == -1)}
                    key={-1}
                    onClick={(item2) => {
                        onClickTag(-1);
                    }}
                >
                    All Filter
                </Button>
                {tags.map((tag, index) => {
                    return (
                        <Button
                            {...STYLE}
                            active={currentChoosingTagIndex.find((item) => item == index) >= 0}
                            key={index}
                            onClick={(item2) => {
                                onClickTag(index);
                            }}
                        >
                            {tag}
                        </Button>
                    );
                })}
            </div>

            <Input placeholder="search By name" value={nameSearch} onChange={onChangeSearchInput} />

            <VerticalList align={VerticalListAlign.CENTER}>
                {listShow.map((item, index) => {
                    return (
                        <div className="itemComponemt" key={index}>
                            <h2>{item.name}</h2>
                            <div className="core">{item.components}</div>
                            {item.code ? <Code>{item.code}</Code> : <></>}
                        </div>
                    );
                })}
            </VerticalList>
        </>
    );
};

ComponentCollection.propTypes = {};

export default ComponentCollection;
