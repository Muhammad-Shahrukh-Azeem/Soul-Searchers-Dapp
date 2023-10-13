const mongoose = require('mongoose');
const { createModel } = require('mongoose-gridfs');
const { conn } = require('./connectDB'); // Import the connection
const fs = require('fs');


let File;
let UpgradedFile;

function initializeFileModels() {
    if (!File) {
        File = createModel({
            modelName: 'File',
            bucketName: 'nftFiles',
            connection: conn
        });
    }

    if (!UpgradedFile) {
        UpgradedFile = createModel({
            modelName: 'UpgradedFile',
            bucketName: 'upgradedNFTs',
            connection: conn
        });
    }

    return File; // Ensure this line is present

}


async function uploadImage(model, filePath, name) {
    // initializeFileModels();
    const readStream = fs.createReadStream(filePath);
    const options = { filename: `${name}.png`, contentType: 'image/png' };

    try {
        const file = await model.write(options, readStream); // Use the passed model here
        console.log("Image uploaded:", file.filename);
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}


async function uploadJSON(model, filePath, name) {
    // initializeFileModels();
    const readStream = fs.createReadStream(filePath);
    const options = { filename: `${name}.json`, contentType: 'application/json' };

    try {
        const file = await model.write(options, readStream);
        console.log("JSON uploaded:", file.filename);
    } catch (error) {
        console.error("Error uploading JSON:", error);
    }
}


async function deleteFile(filename) {
    initializeFileModels();
    try {
        const file = await File.findOne({ filename: filename });
        if (!file) {
            console.log('File not found');
            return;
        }

        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'nftFiles'
        });
        await bucket.delete(file._id);
        console.log('File deleted:', filename);
    } catch (error) {
        console.error("Error deleting file:", error);
    }
}

async function replaceFile(nftId) {
    // Initialize the File models
    initializeFileModels();



    // Fetch the new image from UpgradedFile bucket
    const upgradedImage = await UpgradedFile.findOne({ filename: `${nftId}.png` });
    // initializeFileModels();
    if (!upgradedImage) {
        console.error("Upgraded image not found:", `${nftId}.png`);
        return;
    }

    // Delete the existing file from nftFiles bucket
    await deleteFile(`${nftId}.png`);

    // Create a read stream for the upgraded image
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'upgradedNFTs'
    });
    const upgradedImageStream = bucket.openDownloadStream(upgradedImage._id);

    // Upload the new image to nftFiles bucket
    const options = { filename: `${nftId}.png`, contentType: 'image/png' };
    const file = await File.write(options, upgradedImageStream); // Directly use the GridFSBucketReadStream
    console.log("Image replaced:", file.filename);

    // Optionally, delete the new image from upgradedNFTs bucket if you don't need it there anymore
    // await bucket.delete(upgradedImage._id);
}

async function updateNFTNameInDB(tokenId, newName) {
    const File = initializeFileModels();
    try {
        // Fetch the JSON associated with the tokenId
        const file = await File.findOne({ filename: `${tokenId}.json` });
        if (!file) {
            console.error('File not found');
            return;
        }

        // Create a read stream to read the content of the file
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'nftFiles'
        });
        const readStream = bucket.openDownloadStream(file._id);

        return new Promise((resolve, reject) => {
            // Read the content of the file and parse it to JSON
            let data = '';
            readStream.on('data', chunk => {
                data += chunk.toString('utf8');
            });

            readStream.on('end', async () => {
                try {
                    const fileData = JSON.parse(data);

                    // Update the name field
                    fileData.name = newName;
                    console.log("New File:", fileData);

                    // Delete the old JSON from the database
                    await deleteFile(`${tokenId}.json`);

                    // Ensure /tmp directory exists
                    if (!fs.existsSync('/tmp')) {
                        fs.mkdirSync('/tmp');
                    }

                    // Save the updated JSON to a temporary file
                    const tempFilePath = `/tmp/${tokenId}.json`;
                    fs.writeFileSync(tempFilePath, JSON.stringify(fileData));

                    // Upload the new JSON back to the database
                    await uploadJSON(File, tempFilePath, tokenId);

                    console.log('NFT name updated in the database');
                    resolve();
                } catch (error) {
                    console.error('Error updating NFT name in the database:', error);
                    reject(error);
                }

            });


            readStream.on('error', (error) => {
                console.error('Error reading the file:', error);
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error updating NFT name in the database:', error);
    }
}



// Export the function

module.exports = {
    uploadCurrentImage: async (filePath, name) => {
        initializeFileModels();
        await uploadImage(File, filePath, name);
    },
    uploadUpgradedImage: async (filePath, name) => {
        initializeFileModels();
        await uploadImage(UpgradedFile, filePath, name);
    },
    uploadCurrentJSON: async (filePath, name) => {
        initializeFileModels();
        await uploadJSON(File, filePath, name);
    },
    uploadUpgradedJSON: async (filePath, name) => {
        initializeFileModels();
        await uploadJSON(UpgradedFile, filePath, name);
    },
    getFileModel: initializeFileModels,
    deleteFile,
    replaceFile,
    updateNFTNameInDB
};
