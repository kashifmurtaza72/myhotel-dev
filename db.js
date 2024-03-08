const mongoose = require("mongoose");


const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});


const mongoURL = process.env.MONGODB_URL_LOCAL
//const mongoURL = process.env.MONGODB_URL


mongoose.connect(mongoURL);
const db = mongoose.connection;


// Define event listeners for the database connection
db.on("connected", () => {
  console.log("Connected to MongoDB server");
});


db.on("error", (err) => {
  console.log("Mongodb Connection error", err);
});


db.on("disconnected", () => {
  console.log("Mongodb Disconnected");
});


// Export the database connection
module.exports = db;
