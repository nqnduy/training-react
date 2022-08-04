import withSession from 'plugins/next-session';
// import ApiCall from "modules/ApiCall";

const ApiSession = async (req, res) => {
    let user = req.session.get('user');
    // console.log(user);

    /**
     * check if use token is expired
     * warning: this would cause the app to call this api every time a private route is requested
     */
    // if (user && user.token) {
    //   let checkTokenExpired = await ApiCall({
    //     path: "api/v1/auth/users/profiles",
    //     token: user.token
    //   });

    //   if (typeof checkTokenExpired != "undefined" && !checkTokenExpired.status) {
    //     console.log("[api/session] token is expired!");
    //     user = null;
    //   }
    // }

    return user ? res.json({ loggedIn: true, ...user }) : res.json({ loggedIn: false });
};

export default withSession(ApiSession);
