// pages/api/upgradeName.js
import { updateNFTNameInDB } from '../../backend/controller.js';
import { getConnection } from '../../backend/connectDB';

export default async (req, res) => {
    if (req.method === 'POST') {
        res.setHeader('Cache-Control', 'no-store, max-age=0');

        await getConnection();


        const { wallet, tokenId, newName } = req.body;
        const upgradeResult = true; // You might want to replace this with actual logic later
        if (upgradeResult) {

            try {
                await updateNFTNameInDB(tokenId, newName);
                res.send({ success: true });
            } catch (error) {
                console.error('Error updating the name:', error);
                res.send({ success: false });
            }
        } else {
            res.send({ success: false });
        }

    } else {
        res.status(405).send("Method not allowed");
    }
};
