require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");

function toDate(value) {
  if (!value || typeof value !== "object" || value.$date === undefined)
    return value;
  const dateValue = value.$date;
  const normalized =
    dateValue && typeof dateValue === "object" && dateValue.$numberLong
      ? Number(dateValue.$numberLong)
      : dateValue;
  return new Date(normalized);
}

function loadData(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(raw)) {
    throw new Error("The input JSON must be an array of restaurant documents.");
  }
  return raw.map((restaurant) => ({
    ...restaurant,
    grades: Array.isArray(restaurant.grades)
      ? restaurant.grades.map((grade) => ({
          ...grade,
          score: typeof grade.score === "number" ? grade.score : 0,
          ...(grade.date !== undefined ? { date: toDate(grade.date) } : {}),
        }))
      : [],
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const replaceExisting =
    args.includes("--replace") || args.includes("--force");
  const inputPath = args.find((arg) => !arg.startsWith("--"));
  if (!inputPath) {
    throw new Error('Usage: node seed.js "<path-to-json>" [--replace]');
  }

  const file = path.resolve(inputPath);
  if (!fs.existsSync(file)) throw new Error(`JSON file not found: ${file}`);

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri)
    throw new Error(
      "Set MONGODB_URI or MONGO_URI in backend/.env before importing.",
    );

  const docs = loadData(file);
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "chivogue" });

  try {
    const collection = Restaurant.collection;
    const existing = await collection.countDocuments();
    if (existing > 0 && !replaceExisting) {
      throw new Error(
        `Atlas collection contains ${existing} documents. Re-run with --replace to overwrite.`,
      );
    }

    if (replaceExisting) await collection.deleteMany({});
    const result = await collection.insertMany(docs, { ordered: false });
    console.log(`Imported ${result.insertedCount} documents from ${file}`);
    console.log(
      `Database: ${mongoose.connection.name}; collection: ${collection.collectionName}`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
  mongoose.disconnect().catch(() => {});
});
