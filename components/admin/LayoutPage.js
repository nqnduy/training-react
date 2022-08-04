import { Drawer } from 'antd';
import { HorizontalList, ListItem, ListItemSize, ListType } from 'components/diginext/layout/ListLayout';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import AdminMasterPage from 'components/admin/layout/AdminMasterPage';
import AdminTopBar from 'components/admin/TopBar';
import SidebarAdmin from 'components/admin/SidebarAdmin';
import LayoutContent from './LayoutContent';

const LayoutPage = ({ children, header, user }) => {
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const isDesktop = useMediaQuery({ minWidth: 1025 });
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const [isLayoutSidebar, setIsLayoutSidebar] = useState(true);

    const onSidebarClose = () => {
        setSideBarVisible(false);
    };

    const onMenuClick = () => {
        console.log('Menu clicked');
        setSideBarVisible(true);
    };

    const ShowSidebarLayout = (
        <div className="page-layout">
            <HorizontalList type="start" style={{ position: 'fixed', width: '100%', height: '100%' }}>
                {/* Sidebar */}
                <SidebarAdmin width={250} user={user} style={{ overflow: 'scroll' }} />

                {/* Page Content */}
                <ListItem size="stretch" style={{ height: '100%' }}>
                    <AdminTopBar isMobile={false} user={user} />

                    <LayoutContent>
                        {header}
                        {children}
                    </LayoutContent>
                </ListItem>
            </HorizontalList>
        </div>
    );

    const HideSidebarLayout = (
        <div className="page-layout">
            <Drawer placement="left" width={isPortrait ? '60%' : 250} bodyStyle={{ padding: 0 }} visible={sideBarVisible} onClose={onSidebarClose}>
                <SidebarAdmin width="100%" user={user} />
            </Drawer>

            <AdminTopBar isMobile={true} onMenuClick={onMenuClick} user={user} />

            <LayoutContent>
                {header}
                {children}
            </LayoutContent>
        </div>
    );

    useEffect(() => {
        if (isDesktop) {
            setIsLayoutSidebar(true);
        } else {
            setIsLayoutSidebar(false);
        }
    });

    return (
        <AdminMasterPage>
            {isLayoutSidebar ? ShowSidebarLayout : HideSidebarLayout}
            {/* {HideSidebarLayout} */}
        </AdminMasterPage>
    );

    // return isDesktop ? ShowSidebarLayout : HideSidebarLayout;
};

export default LayoutPage;
