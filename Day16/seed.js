require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Profile = require("./models/Profile");
const Skill = require("./models/Skill");
const Technology = require("./models/Technology");
const Project = require("./models/Project");
const Experience = require("./models/Experience");

(async () => {
  try {
    await connectDB();

   
    await Promise.all([
      User.deleteMany(),
      Profile.deleteMany(),
      Skill.deleteMany(),
      Technology.deleteMany(),
      Project.deleteMany(),
      Experience.deleteMany()
    ]);

    // 1) User create
    const user = await User.create({
      name: "Puja",
      email: "puja@test.com",
      password: "mypassword" // normally bcrypt karna hota
    });

    // 2) Profile
    await Profile.create({
      user: user._id,
      headline: "Full Stack Developer",
      summary: "Building MERN apps",
      location: "Delhi"
    });

    // 3) Skills
    const react = await Skill.create({ user: user._id, name: "React", level: "Expert" });
    const node = await Skill.create({ user: user._id, name: "Node.js", level: "Intermediate" });
    const mongo = await Skill.create({ user: user._id, name: "MongoDB", level: "Intermediate" });

    // 4) Technologies
    const express = await Technology.create({ user: user._id, name: "Express" });
    const tailwind = await Technology.create({ user: user._id, name: "Tailwind" });

    // 5) Project
    await Project.create({
      user: user._id,
      title: "TaskFlow",
      description: "Team task management app",
      skills: [react._id, node._id],
      technologies: [express._id],
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-12-01")
    });

    // 6) Experience
    await Experience.create({
      user: user._id,
      company: "TCS",
      title: "Software Engineer",
      startDate: new Date("2021-05-01"),
      endDate: new Date("2023-04-30"),
      description: "Worked on enterprise web apps"
    });

    console.log(" Seed data inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();