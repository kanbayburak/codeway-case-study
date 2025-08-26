const express = require("express");
const cors = require("cors");
require("dotenv").config();

const configRoutes = require("./routes/configRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api", configRoutes);

module.exports = app;
