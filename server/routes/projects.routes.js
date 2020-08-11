const express = require("express");
const router = express.Router();
const {
	allProjects,
	addProject,
	deleteProject,
	updateProjectName,
	updateProjectDescription,
	addProjectEmployee,
	removeProjectEmployee,
	oneProject,
} = require("../controllers/projects.controllers");

router.get("/all-projects/:userId", allProjects);

router.get("/one-project/:projectId", oneProject);

router.post("/add-project", addProject);

router.delete("/delete-project/:id", deleteProject);

router.put("/update-project-name", updateProjectName);

router.put("/update-project-desc", updateProjectDescription);

router.put("/add-project-emp", addProjectEmployee);

router.put("/remove-project-emp", removeProjectEmployee);

module.exports = router;
