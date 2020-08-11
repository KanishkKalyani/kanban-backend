const Task = require("../models/tasks.model");

exports.addTask = (req, res) => {
	const { storyId, name, projectId, featureId } = req.body;

	const newTask = new Task({ storyId, name, projectId, featureId });

	Task.findOne({ storyId, name }).exec((err, task) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (task) {
			return res.status(400).json({
				error: `Task with name "${task.name}" already exists`,
			});
		}

		newTask.save((err, taskData) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			res.json({
				message: `${taskData.name} saved.`,
				task: taskData,
			});
		});
	});
};

exports.allTasks = (req, res) => {
	const { storyId } = req.params;

	Task.find({ storyId })
		.sort({ index: 1 })
		.exec((err, allTasks) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			return res.json({ tasks: allTasks });
		});
};

exports.deleteTask = (req, res) => {
	const { id } = req.params;

	Task.findOneAndDelete({ _id: id }).exec((err, task) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!task) {
			return res.status(400).json({
				error: "Specified Task does not exist.",
			});
		}

		return res.json({ deleted: task });
	});
};

exports.updateTask = (req, res) => {
	const { id, name, column, index } = req.body;

	Task.updateOne(
		{ _id: id },
		{
			name: name,
			column: column,
			index: index,
		}
	).exec((err, task) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!task) {
			return res.status(400).json({
				error: "Specified Task does not exist.",
			});
		}

		return res.json({ updated: task });
	});
};
