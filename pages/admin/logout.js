import AdminMasterPage from 'components/admin/layout/AdminMasterPage';
import { useRouter } from 'next/router';
import CONFIG from 'web.config';
import React, { useEffect } from 'react';
import Axios from 'axios';

const AdminLogout = ({ user }) => {
    const router = useRouter();

    const init = async () => {
        // const logout = ApiLogout({token: user.token})
        let res = await Axios({
            url: `${CONFIG.getBasePath()}/api/logout`,
            method: 'GET',
        });
        // console.log(res);
        router.push('/admin/login');
    };

    useEffect(() => {
        init();
    }, []);

    return <AdminMasterPage></AdminMasterPage>;
};

export default AdminLogout;
