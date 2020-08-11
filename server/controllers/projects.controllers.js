const Project = require("../models/projects.model");
const Feature = require("../models/features.model");
const Story = require("../models/stories.model");
const Task = require("../models/tasks.model");

exports.addProject = (req, res) => {
	const { userId, name, userName } = req.body;

	const managerId = userId,
		employee = [{ id: userId, name: userName }];

	const newProject = new Project({ managerId, employee, name });

	Project.findOne({ managerId, name }).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (project) {
			return res.status(400).json({
				error: `Project with name "${name}" already exists`,
			});
		}

		newProject.save((err, projectData) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			res.json({
				message: `${projectData.name} saved.`,
				project: projectData,
			});
		});
	});
};

exports.allProjects = (req, res) => {
	const { userId } = req.params;

	Project.find({ "employee.id": userId }).exec((err, allProjects) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}
		return res.json({ projects: allProjects });
	});
};

exports.oneProject = (req, res) => {
	const { projectId } = req.params;

	Project.findOne({ _id: projectId }).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}
		return res.json({ project: project });
	});
};

exports.deleteProject = (req, res) => {
	const { id } = req.params;

	Task.deleteMany({ projectId: id }).exec((err, __) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}
	});

	Story.deleteMany({ projectId: id }).exec((err, __) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}
	});

	Feature.deleteMany({ projectId: id }).exec((err, __) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}
	});

	Project.findOneAndDelete({ _id: id }).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!project) {
			return res.status(400).json({
				error: "Specified project does not exist.",
			});
		}

		return res.json({ deleted: project });
	});
};

exports.updateProjectName = (req, res) => {
	const { userId, id, name } = req.body;
	const managerId = userId;
	Project.findOne({ managerId, name }).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (project) {
			return res.status(400).json({
				error: `Project with name "${name}" already exists`,
			});
		} else {
			Project.updateOne(
				{ _id: id },
				{
					name: name,
				}
			).exec((err, project) => {
				if (err) {
					return res.status(400).json({
						error: "Something went wrong",
					});
				}

				if (!project) {
					return res.status(400).json({
						error: "Specified project does not exist.",
					});
				}

				return res.json({ updated: project });
			});
		}
	});
};

exports.updateProjectDescription = (req, res) => {
	const { id, description } = req.body;

	Project.updateOne(
		{ _id: id },
		{
			description: description,
		}
	).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!project) {
			return res.status(400).json({
				error: "Specified project does not exist.",
			});
		}

		return res.json({ updated: project });
	});
};

exports.addProjectEmployee = (req, res) => {
	const { id, employeeId, employeeName } = req.body;

	Project.updateOne(
		{ _id: id },
		{ $push: { employee: { id: employeeId, name: employeeName } } }
	).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!project) {
			return res.status(400).json({
				error: "Specified project does not exist.",
			});
		}

		return res.json({ updated: project });
	});
};

exports.removeProjectEmployee = (req, res) => {
	const { projectId, employee } = req.body;

	Project.find({ _id: projectId }).exec((err, project) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (project) {
			Project.updateOne(
				{ _id: projectId },
				{
					employee: employee,
				}
			).exec((err, project) => {
				if (err) {
					return res.status(400).json({
						error: "Something went wrong",
					});
				}

				return res.json({ updated: project });
			});
		} else {
			return res.status(400).json({
				error: "Specified project does not exist.",
			});
		}
	});
};
