// pages/api/upgradeNFT.js
import { replaceFile } from '../../backend/controller.js';
import { getConnection } from '../../backend/connectDB';

export default async (req, res) => {
    if (req.method === 'POST') {
        await getConnection();
        const { tokenId } = req.body;
        const upgradeResult = true;
        if (upgradeResult) {
            await replaceFile(tokenId);
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    } else {
        res.status(405).send("Method not allowed");
    }
};
