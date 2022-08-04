import { withIronSession } from 'next-iron-session';
import CONFIG from 'web.config';

// (process.env);

export const SessionConfig = {
    cookieName: CONFIG.IRON_SESSION_NAME,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
    },
    password: CONFIG.IRON_SESSION_SECRET,
};

export default function withSession(handler) {
    return withIronSession(handler, SessionConfig);
}

const checkLoginSession = async ({ req, res, then }) => {
    let user = req.session.get('user');

    // (then);

    if (!user) {
        // redirect to LOGIN if session not existed:
        console.error('[SESSION] user not found.');

        // res.setHeader("location", CONFIG.getBasePath() + "/login");
        // res.statusCode = 302;
        // res.writeHead(302, { Location: CONFIG.getBasePath() + "/login" });
        // res.end();

        res.set('location', CONFIG.getBasePath() + 'login');
        res.status(301).send();

        // res.redirect(302, CONFIG.getBasePath() + "/login");
        // res.end();

        return { props: { redirect: CONFIG.getBasePath() + '/login' } };
    } else {
        // check token expired
        // let checkLogin = await ApiCall({
        //   path: "kyanon-profile-api/api/v1/admin/users/profiles",
        //   token: user.token,
        // });
        // (checkLogin);

        // redirect to LOGIN page if token is expired:
        // if (!checkLogin.status) {
        //   res.setHeader("location", CONFIG.getBasePath() + "/login");
        //   res.statusCode = 302;
        //   res.end();
        //   return { props: {} };
        // }

        return { props: { user } };
    }
};

export const getServerSideProps = withIronSession(checkLoginSession, SessionConfig);
