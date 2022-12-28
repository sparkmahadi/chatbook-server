const express = require("express");
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const connectDB = require("./config/db");
dotenv.config();

connectDB();
const app = express();

app.get("/", (req, res) => {
    res.send("API is running..");
  });

app.listen(port, console.log(`chatbook server is running on port ${port}`));