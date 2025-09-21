const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Technology = require('../models/Technology');
const Experience = require('../models/Experience');

// @route   GET /api/combined/profile/dashboard
router.get('/profile/dashboard', async (req, res) => {
  try {
    const profile = await Profile.find().populate('skills projects');
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/combined/profile/portfolio
router.get('/profile/portfolio', async (req, res) => {
  try {
    const projects = await Project.find().populate('technologies');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/combined/search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const skills = await Skill.find({ name: new RegExp(q, 'i') });
    const projects = await Project.find({ title: new RegExp(q, 'i') });
    const technologies = await Technology.find({ name: new RegExp(q, 'i') });
    const experience = await Experience.find({ company: new RegExp(q, 'i') });

    res.json({ skills, projects, technologies, experience });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;