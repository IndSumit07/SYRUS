import Project from "../../models/Project.model.js";

import Report from "../../models/Report.model.js";

import Activity from "../../models/Activity.model.js";

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { name, url } = req.body;

    const project = await Project.create({
      user: req.user._id,
      name,
      url,
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: "project_created",
      details: {
        projectId: project._id,
        projectName: project.name,
        projectUrl: project.url,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for logged in user with latest SEO summary
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const latestReport = await Report.findOne({ project: project._id })
          .sort({ createdAt: -1 })
          .select("score createdAt improvements");

        return {
          ...project.toObject(),
          latestReport,
        };
      }),
    );

    res.json(enrichedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID with reports
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project && project.user.toString() === req.user._id.toString()) {
      const reports = await Report.find({ project: req.params.id }).sort({
        createdAt: -1,
      });
      res.json({ ...project.toObject(), reports });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project && project.user.toString() === req.user._id.toString()) {
      await project.deleteOne();
      res.json({ message: "Project removed" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
