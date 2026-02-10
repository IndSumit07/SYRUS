import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} from "./project.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createProject).get(protect, getProjects);
router
  .route("/:id")
  .get(protect, getProjectById)
  .delete(protect, deleteProject);

export default router;
