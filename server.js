require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("./src/models/Company");

const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "JobBoard Pro" }));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`JobBoard Pro running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
