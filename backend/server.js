const express = require('express');
const bodyParser = require('body-parser');
const { getConnection } = require('./connectDB');
const { uploadCurrentImage, uploadUpgradedImage, getFileModel, replaceFile, deleteFile, uploadCurrentJSON } = require('./controller');
const { conn } = require('./connectDB');
const mongoose = require('mongoose');



const app = express();

app.use(bodyParser.json());

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Connect to MongoDB
getConnection()
    .then(async () => {
        // Initialize the models
        getFileModel();

        // Upload the image to the nftFiles bucket
        // for (let i = 0; i < 1; i++) {
        //     await uploadCurrentImage(`./backend/Images/${i}.png`, i);
        //     await delay(2000); // Wait for seconds before the next upload
        // }

        // Upload the image to the nftFiles bucket
        // for (let i = 0; i < 1; i++) {
        //     await uploadCurrentJSON(`./backend/metaData/${i}.json`, i);
        //     await delay(300); // Wait for seconds before the next upload
        // }



        // Upload the new image to the upgradedNFTs bucket
        // await uploadUpgradedImage("./backend/NewImages/0.png", 0);

        // Upgrade the NFT to the new image
        // await replaceFile(0); // Replace the image for NFT with ID 0

        // Delete NFT data
        // for (let i = 0; i < 1; i++) {
        //     await deleteFile(`${i}.png`);
        // }



    })
    .catch(error => {
        console.error("Error during MongoDB connection or image upload:", error);
    });

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
