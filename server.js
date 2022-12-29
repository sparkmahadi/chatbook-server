const express = require("express");
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const connectDB = require("./config/db");
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);

app.use(notFound)
app.use(errorHandler)

app.get("/", (req, res) => {
    res.send("API is running..");
  });

app.listen(port, console.log(`chatbook server is running on port ${port}`.yellow.bold));