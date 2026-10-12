require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const restaurantRoutes = require("./routes/restaurants");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Connect to MongoDB Atlas (supports both MONGODB_URI and MONGO_URI).
// Keep the connection lazy and await it before handling API requests so a
// serverless cold start never queries MongoDB before the connection is ready.
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
let mongoConnection;

async function ensureDatabaseConnection() {
  if (!uri) throw new Error("MongoDB connection is not configured.");
  try {
    if (mongoose.connection.readyState !== 1) {
      mongoConnection ||= mongoose.connect(uri, {
        dbName: process.env.MONGODB_DB || "chivogue",
        serverSelectionTimeoutMS:
          Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 8000,
      });
      await mongoConnection;
    }
  } catch (err) {
    mongoConnection = undefined;
    throw err;
  }
}

// This readiness check verifies both API routing and an actual database connection.
app.get("/api/health", async (req, res) => {
  try {
    await ensureDatabaseConnection();
    res.json({ ok: true, databaseConfigured: true, databaseConnected: true });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(503).json({
      ok: false,
      databaseConfigured: Boolean(uri),
      databaseConnected: false,
      message: uri
        ? "Could not connect to the restaurant database."
        : "MongoDB connection is not configured.",
    });
  }
});

app.use("/api", async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(503).json({
      message: uri
        ? "Could not connect to the restaurant database."
        : "MongoDB connection is not configured.",
    });
  }
});

// API Endpoints (registered after the database readiness middleware).
app.use("/api/restaurants", restaurantRoutes);

// Local development listener
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`ChiVogue running at http://localhost:${PORT}`);
  });
}

// Export app for Vercel serverless deployment
module.exports = app;
