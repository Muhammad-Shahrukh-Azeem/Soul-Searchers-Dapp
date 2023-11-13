// pages/api/file/[filename].js

import { getFileModel } from '../../../backend/controller';
import { getConnection, conn } from '../../../backend/connectDB';
import mongoose from 'mongoose';

export default async (req, res) => {
    // Ensure the database connection is established
    try {
        await getConnection();
    } catch (error) {
        console.error("Error establishing database connection:", error);
        return res.status(500).send("Database connection error");
    }
    // Now you can use the File model
    const File = getFileModel();

    if (req.method === 'GET') {
        const filename = req.query.filename;
        try {
            const file = await File.findOne({ filename: filename });
            if (!file) {
                return res.status(404).send('File not found');
            }
            res.setHeader('Content-Type', file.contentType);
            // This will display the image inline instead of downloading it
            res.setHeader('Content-Disposition', 'inline; filename="' + file.filename + '"');

            // Set caching headers to cache the image in the browser for a year
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

            // Use GridFSBucket to create a read stream
            const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'upgradedNFTs'
            });
            const readStream = bucket.openDownloadStream(file._id);

            readStream.pipe(res);
        } catch (error) {
            console.error("Error retrieving file:", error);
            res.status(500).send("Error retrieving file");
        }
    } else {
        res.status(405).send("Method not allowed");
    }
};
