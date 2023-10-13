// pages/api/replace.js

import { replaceFile } from '../../backend/controller';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { nftId, imagePath, jsonPath } = req.body;
        try {
            await replaceFile(nftId, imagePath, jsonPath);
            res.status(200).send('Files replaced successfully');
        } catch (error) {
            console.error("Error replacing files:", error);
            res.status(500).send("Error replacing files");
        }
    } else {
        res.status(405).send("Method not allowed");
    }
};
