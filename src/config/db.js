const mongoose = require("mongoose");

async function connectionDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("Server is connected to DB");
  } catch (error) {
    console.error("Error connecting to DB", error);
    process.exit(1);
  }
}

module.exports = connectionDB;
