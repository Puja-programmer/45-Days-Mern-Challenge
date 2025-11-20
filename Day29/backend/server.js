require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

/* ------------------- MIDDLEWARE ------------------- */

// JSON parser
app.use(express.json());

// CORS with whitelist support
const allowedOrigins = (process.env.CORS_WHITELIST || "*").split(",");
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin))
        cb(null, true);
      else cb(new Error("CORS not allowed: " + origin));
    },
  })
);

// Security headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Rate limiting (prevents brute force)
app.use(
  "/api",
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500, // limit each IP
    message: "Too many requests, try again later.",
  })
);


/* ------------------- MONGOOSE MODEL ------------------- */

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, "Company name is required"] },
    position: { type: String, required: [true, "Position is required"] },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: [String],
      validate: {
        validator: (arr) => arr.every((item) => typeof item === "string"),
        message: "Skills must be an array of strings",
      },
    },

    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Validate start < end
experienceSchema.pre("save", function (next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    return next(new Error("End date cannot be earlier than start date"));
  }
  next();
});

const Experience = mongoose.model("Experience", experienceSchema);


/* ------------------- ASYNC WRAPPER ------------------- */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


/* ------------------- ROUTES ------------------- */

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "OK", db: mongoose.connection.readyState });
});

// GET all experiences + filters
app.get(
  "/api/experiences",
  asyncHandler(async (req, res) => {
    const { company, position, q, archived, sort = "-startDate" } = req.query;

    const filter = {
      ...(archived !== undefined && { archived: archived === "true" }),
      ...(company && { company: new RegExp(company, "i") }),
      ...(position && { position: new RegExp(position, "i") }),
      ...(q && {
        $or: [
          { company: new RegExp(q, "i") },
          { position: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
          { skills: new RegExp(q, "i") },
        ],
      }),
    };

    const experiences = await Experience.find(filter).sort(sort);
    res.json(experiences);
  })
);

// GET single experience
app.get(
  "/api/experiences/:id",
  asyncHandler(async (req, res) => {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: "Experience not found" });
    res.json(exp);
  })
);

// CREATE
app.post(
  "/api/experiences",
  asyncHandler(async (req, res) => {
    const exp = new Experience(req.body);
    const saved = await exp.save();
    res.status(201).json(saved);
  })
);

// UPDATE
app.put(
  "/api/experiences/:id",
  asyncHandler(async (req, res) => {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Experience not found" });

    res.json(updated);
  })
);

// DELETE one
app.delete(
  "/api/experiences/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Experience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Experience not found" });

    res.json({ message: "Experience deleted successfully" });
  })
);

// DELETE all (safe mode)
app.delete(
  "/api/experiences",
  asyncHandler(async (req, res) => {
    if (req.query.confirm !== "yes")
      return res.status(400).json({
        error: "Add ?confirm=yes to delete ALL experiences",
      });

    await Experience.deleteMany();
    res.json({ message: "All experiences removed" });
  })
);


/* ------------------- GLOBAL ERROR HANDLER ------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // CastError for invalid IDs
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  res.status(500).json({ error: err.message || "Internal server error" });
});


/* ------------------- DB CONNECTION ------------------- */
if (!process.env.MONGO_URI) {
  console.warn("⚠️ Warning: MONGO_URI not set. Using local DB.");
}

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/workexp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


/* ------------------- START SERVER ------------------- */
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  mongoose.connection.close(() => {
    console.log("🔌 MongoDB disconnected");
    process.exit(0);
  });
});
