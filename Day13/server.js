const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://yourfrontend.com'],
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const workExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);
const WorkExperience = mongoose.model("WorkExperience", workExperienceSchema);
const validateExperience = [
  body("company").notEmpty().withMessage("Company is required"),
  body("position").notEmpty().withMessage("Position is required"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (value && req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date cannot be before start date");
      }
      return true;
    }),
];

app.post("/api/experience", validateExperience, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const exp = await WorkExperience.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
});

app.get("/api/experience", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.position) filter.position = req.query.position;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await WorkExperience.find(filter).skip(skip).limit(limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.put("/api/experience/:id", validateExperience, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const exp = await WorkExperience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exp) return res.status(404).json({ message: "Not Found" });
    res.json(exp);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/experience/:id", async (req, res, next) => {
  try {
    const exp = await WorkExperience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
