const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Technology = require('../models/Technology');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const [profile, skills, projects, experiences] = await Promise.all([
      Profile.findOne({ user: userId }).populate('user', 'name email'),
      Skill.find({ user: userId }),
      Project.find({ user: userId }).populate('technologies skills'),
      Experience.find({ user: userId })
    ]);
    const summary = {
      counts: {
        skills: skills.length,
        projects: projects.length,
        experiences: experiences.length
      }
    };
    res.json({ profile, skills, projects, experiences, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ user: userId })
      .populate('technologies skills')
      .sort({ startDate: -1 });
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchAcross = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ msg: 'q query param required' });
    const regex = new RegExp(q, 'i');

    // parallel searches
    const [projects, skills, technologies, profiles] = await Promise.all([
      Project.find({ $or: [{ title: regex }, { description: regex }] }).limit(50).populate('technologies skills'),
      Skill.find({ name: regex }).limit(50),
      Technology.find({ name: regex }).limit(50),
      Profile.find({ $or: [{ headline: regex }, { summary: regex }] }).limit(10)
    ]);

    // return grouped results (simple relevance: projects first)
    res.json({ projects, skills, technologies, profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.analyticsSkills = async (req, res) => {
  try {
    // Count how many projects use each skill
    const pipeline = [
      { $unwind: '$skills' },
      { $group: { _id: '$skills', projectsCount: { $sum: 1 } } },
      { $lookup: { from: 'skills', localField: '_id', foreignField: '_id', as: 'skill' } },
      { $unwind: '$skill' },
      { $project: { skillId: '$skill._id', name: '$skill.name', projectsCount: 1 } },
      { $sort: { projectsCount: -1 } }
    ];
    const data = await Project.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.analyticsTechnology = async (req, res) => {
  try {
    // Count across projects -> technologies
    const pipeline = [
      { $unwind: '$technologies' },
      { $group: { _id: '$technologies', projectsCount: { $sum: 1 } } },
      { $lookup: { from: 'technologies', localField: '_id', foreignField: '_id', as: 'tech' } },
      { $unwind: '$tech' },
      { $project: { techId: '$tech._id', name: '$tech.name', projectsCount: 1 } },
      { $sort: { projectsCount: -1 } }
    ];
    const data = await Project.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.analyticsCareer = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.id);
    // timeline per start year: roles and counts
    const pipeline = [
      { $match: { user: userId } },
      { $project: { title: 1, company: 1, startYear: { $year: '$startDate' }, startDate: 1, endDate: 1 } },
      { $group: { _id: '$startYear', roles: { $push: { title: '$title', company: '$company', startDate: '$startDate', endDate: '$endDate' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ];
    const data = await Experience.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};