import withSession from 'plugins/next-session/admin';

const ApiLogout = async (req, res) => {
    req.session.unset('user');
    await req.session.save();
    return res.status(200).json({ status: 1 });
};

export default withSession(ApiLogout);
