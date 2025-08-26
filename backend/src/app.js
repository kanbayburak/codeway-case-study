const express = require("express");
const cors = require("cors");
require("dotenv").config();

const configRoutes = require("./routes/configRoutes");

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",                    // local geliştirme için
    "https://codeway-case-study-green.vercel.app" // Vercel frontend için
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api", configRoutes);

module.exports = app;
