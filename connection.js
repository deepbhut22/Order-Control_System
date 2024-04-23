const mongoose = require("mongoose");
require("dotenv").config();

// enter MONGO_URL in .env file

const connection = mongoose.connect("mongodb://127.0.0.1:27017/DEDB");


module.exports = connection;
