const mongoose = require("mongoose");

const uri = "mongodb://admin:Magicsoul123@localhost:27017/test";

const conn = mongoose.connection;

const getConnection = async () => {
  while (conn.readyState !== 1) {
    console.log("DB not ready, current state: ", conn.readyState);
    if (conn.readyState === 0) {
      try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      } catch (error) {
        return Promise.reject(error);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
  }
  console.log("DB Connected");
};
// "mongodb+srv://admin:Magicsoul123@searchersnft.inf2j.mongodb.net/?retryWrites=true&w=majority"


module.exports = {
  getConnection,
  conn // export the connection
};
