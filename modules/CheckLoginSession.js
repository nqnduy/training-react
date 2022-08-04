import CONFIG from 'web.config';
import ApiCall from './ApiCall';

const CheckLoginSession = async ({ req, res, then }) => {
    let user = req.session.get('user');

    if (!user) {
        res.setHeader('location', CONFIG.getBasePath() + '/admin/login');
        res.statusCode = 302;
        res.end();
        return { props: {} };
    } else {
        // check token expired
        let checkLogin = await ApiCall({
            path: '/api/v1/admin/users/profiles',
            token: user.token,
        });

        if (!checkLogin.status) {
            res.setHeader('location', CONFIG.getBasePath() + '/admin/login');
            res.statusCode = 302;
            res.end();
            return { props: {} };
        }
    }

    if (!user) {
        return { props: {} };
    } else {
        return { props: { user } };
    }
};

export default CheckLoginSession;
