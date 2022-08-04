import AdminMasterPage from 'components/admin/layout/AdminMasterPage';

import {
    HorizontalList,
    VerticalList,
    GridList,
    ListItem,
    ListItemSize,
    ListType,
    VerticalListAlign,
    HorizontalListAlign,
} from 'components/diginext/layout/ListLayout';

import Section from 'components/diginext/containers/Section';
import asset from 'plugins/assets/asset';
import ExpandContainer from 'components/diginext/containers/ExpandContainer';
import SidebarComponentList from 'components/dashkit/SidebarComponentList';

const BasicsPage = () => {
    return (
        <AdminMasterPage>
            <HorizontalList type="start" style={{ position: 'fixed', width: '100%', height: '100%' }}>
                {/* Sidebar */}
                <SidebarComponentList />

                {/* Page Content */}
                <ListItem size="stretch">
                    <ExpandContainer>
                        <Section id="alerts" padding="30px">
                            <h1>Basics</h1>
                        </Section>
                    </ExpandContainer>
                </ListItem>
            </HorizontalList>
        </AdminMasterPage>
    );
};

export default BasicsPage;
