import withSession from 'plugins/next-session/admin';
import ApiCall from 'modules/ApiCall';

export default withSession(async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        let loginApi = await ApiCall({
            method: 'post',
            path: '/api/v1/auth/users/login',
            data: {
                email,
                password,
            },
        });

        if (loginApi && loginApi.status) {
            const token = loginApi.data.token;
            const id = loginApi.data.id;
            const profileImage = loginApi.data.profileImage;
            let permissions = {};
            let isAdmin = false;

            if (typeof loginApi.data.role != 'undefined' && typeof loginApi.data.role.permissions != 'undefined') {
                permissions = loginApi.data.role.permissions;
            }

            if (typeof loginApi.data.role != 'undefined' && typeof loginApi.data.role.isAdmin != 'undefined') {
                isAdmin = loginApi.data.role.isAdmin;
            }

            const userPermission = {
                isAdmin,
                permissions,
            };

            req.session.set('user', { id, email, token, profileImage, userPermission });
            await req.session.save();
        }

        return res.json(loginApi);
    } else {
        return res.status(404).send('');
    }
});
