const HandleError = async (req, res) => {
    try {
        if (req.method === 'POST') {
            const data = req.body;
            console.log('data :>> ', data);
            if (data) {
                if (typeof data == 'string') console.log(`data ERROR:`, data);
                else console.log(`data ERROR: `, JSON.stringify(data));

                return res.status(200).json({
                    status: true,
                    data: { message: 'no data' },
                });
            }

            return res.status(400).json({ status: false, message: 'no data' });
        }
    } catch (error) {
        console.log(`HandleError error`, error);
    }

    return res.status(400).json({ status: false, message: 'something wrong' });
};

export default HandleError;
