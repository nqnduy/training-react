import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEventEmitter } from 'ahooks';
import ArrayExtra from 'plugins/utils/ArrayExtra';
import generateUUID from 'plugins/utils/Uuid';
import { ListenerContext } from '@/components/website/contexts/ListenerProvider';
import PopupEvents from 'components/website/contexts/data/PopupEvents';

const PopupContext = createContext();

const list = [];

const PopupProvider = (props) => {
    const listener = useContext(ListenerContext);

    const [popup, setPopup] = useState([]);

    if (listener) {
        listener.useSubscription((e) => {
            onListen(e);
        });
    }

    const onListen = (e) => {
        const type = e.type;
        switch (type) {
            case PopupEvents.ADD_POPUP:
                {
                    const { name, item } = e;
                    if (item)
                        addPopup({
                            name,
                            item,
                        });
                }
                break;

            case PopupEvents.REMOVE_POPUP:
                {
                    const { name } = e;
                    if (name) removePopupByName(name);
                }
                break;

            case PopupEvents.REMVOE_ALL_POPUP:
                {
                    removeAllPopup();
                }
                break;
            default:
                break;
        }
    };

    const checkPopupByName = (name) => {
        return popup.find((item) => {
            return item.name == name;
        });
    };

    const addPopup = ({ name, item }) => {
        console.log('addPopup :>> ', name, popup);
        if (checkPopupByName(name)) {
        } else {
            const uuid = generateUUID();
            list.push({
                name,
                item,
                uuid,
            });

            checkListPopup();
        }
    };

    const removeAllPopup = (params) => {
        setPopup([]);
    };

    const removePopupByName = (name) => {
        console.log(`removePopupByName`, name);

        ArrayExtra.removeItemByKey('name', name, list);

        checkListPopup();
    };

    const checkListPopup = (params) => {
        const __popup = popup.filter((item) => {
            return list.findIndex((x) => x.uuid == item.uuid) >= 0;
        });

        const _listAdd = list.filter((item) => {
            return popup.findIndex((x) => x.uuid == item.uuid) == -1;
        });
        __popup.push(..._listAdd);

        setPopup(__popup);
    };

    return (
        <>
            <style jsx>{`
                .holder {
                    position: fixed;
                    z-index: 50;
                }
            `}</style>

            <PopupContext.Provider value={listener}>
                {popup.map((core, index) => {
                    return (
                        <div className="" key={index}>
                            {core.item}
                        </div>
                    );
                })}

                {props.children}
            </PopupContext.Provider>
        </>
    );
};

export default PopupProvider;
