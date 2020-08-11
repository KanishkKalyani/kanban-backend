const express = require("express");
const router = express.Router();
const {
	allTasks,
	addTask,
	deleteTask,
	updateTask,
} = require("../controllers/tasks.controllers");

router.get("/all-tasks/:storyId", allTasks);

router.post("/add-task", addTask);

router.delete("/delete-task/:id", deleteTask);

router.put("/update-task", updateTask);

module.exports = router;
