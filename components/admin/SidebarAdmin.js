import Sidebar from 'components/diginext/containers/Sidebar';
import AdminLogo from 'components/dashkit/Logo';
import AdminIcon from 'components/dashkit/Icon';
import AppLink from 'components/diginext/link/AppLink';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { checkPermission } from '@/helpers/helpers';
import { Menu } from 'antd';
import { menus } from 'modules/config/menu';
const { SubMenu } = Menu;

const SidebarAdmin = ({ children, width = 250, user }) => {
    const router = useRouter();
    //active submenu
    let currentSubmenu = '';
    let regexMatch = router.pathname.match(/^\/admin\/(.+?)*(\/|$)/);
    let originRoutePath = regexMatch && typeof regexMatch[0] != 'undefined' ? regexMatch[0] : router.pathname;
    originRoutePath = originRoutePath[originRoutePath.length - 1] != '/' ? originRoutePath : originRoutePath.substring(0, originRoutePath.length - 1);
    menus.forEach(function (submenu) {
        if (submenu.children.length >= 1) {
            submenu.children.forEach(function (menuitem) {
                if (menuitem.key == originRoutePath) {
                    currentSubmenu = submenu.key;
                }
            });
        }
    });

    const [dataPermisison, setDataPermission] = useState({});
    useEffect(() => {
        setDataPermission(localStorage.getItem('permissions') !== 'undefined' ? JSON.parse(localStorage.getItem('permissions')) : {});
    }, []);

    const checkPermissionMenu = (permission) => {
        if (user.userPermission.isAdmin) {
            return true;
        }
        const key = Object.keys(dataPermisison);
        for (let i = 0; i < permission.length; i++) {
            const find = key.find((el) => el == permission[i]);
            if (find) {
                return true;
            }
        }
        return false;
    };

    return (
        <Sidebar width={width}>
            <AdminLogo maxWidth="60%" style={{ paddingTop: '1.2rem', paddingBottom: '1.2rem' }} />
            <Menu
                style={{ width: width }}
                defaultSelectedKeys={[router.pathname]}
                defaultOpenKeys={['admin-products', 'admin-users', currentSubmenu]}
                mode="inline"
            >
                <Menu.Item key="/admin">
                    <AppLink href="/admin">
                        <AdminIcon name="dashboard" />
                        <span>Dashboard</span>
                    </AppLink>
                </Menu.Item>

                {menus.map((route) => {
                    return route.children.length <= 0 ? (
                        <Menu.Item style={{ display: checkPermissionMenu(route.permissions) ? '' : 'none' }} key={route.path}>
                            <AppLink href={route.path}>
                                {route.meta?.icon && <AdminIcon name={route.meta.icon} />}
                                <span>{route.name}</span>
                            </AppLink>
                        </Menu.Item>
                    ) : (
                        <SubMenu
                            style={{ display: checkPermissionMenu(route.permissions) ? '' : 'none' }}
                            key={route.key}
                            title={
                                <span>
                                    {route.meta?.icon && <AdminIcon name={route.meta.icon} />}
                                    <span>{route.name}</span>
                                </span>
                            }
                        >
                            {route.children.map((child) => {
                                return (
                                    <Menu.Item
                                        style={{ marginTop: '1.2rem !important', display: checkPermissionMenu(child.permissions) ? '' : 'none' }}
                                        key={child.key}
                                    >
                                        <AppLink href={`${child.path}`}>
                                            {child.meta?.icon} <span>{child.name}</span>
                                        </AppLink>
                                    </Menu.Item>
                                );
                            })}
                        </SubMenu>
                    );
                })}
            </Menu>
        </Sidebar>
    );
};

export default SidebarAdmin;
