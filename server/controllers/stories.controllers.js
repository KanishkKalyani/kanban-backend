const Story = require("../models/stories.model");
const Task = require("../models/tasks.model");

exports.addStory = (req, res) => {
	const { featureId, name, projectId } = req.body;

	const newStory = new Story({ featureId, name, projectId });

	Story.findOne({ featureId, name }).exec((err, story) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong 1 ${err}`,
			});
		}

		if (story) {
			return res.status(400).json({
				error: `Story with name "${story.name}" already exists`,
			});
		}

		newStory.save((err, storyData) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong 2 ${err}`,
				});
			}

			res.json({
				message: `${storyData.name} saved.`,
				story: storyData,
			});
		});
	});
};

exports.allStories = (req, res) => {
	const { featureId } = req.params;

	Story.find({ featureId }).exec((err, allStories) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		return res.json({ stories: allStories });
	});
};

exports.deleteStory = (req, res) => {
	const { id } = req.params;

	Task.deleteMany({ storyId: id }).exec((err, __) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}
	});

	Story.findOneAndDelete({ _id: id }).exec((err, story) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!story) {
			return res.status(400).json({
				error: "Specified story does not exist.",
			});
		}

		return res.json({ deleted: story });
	});
};

exports.updateStory = (req, res) => {
	const { featureId, id, name, columns } = req.body;

	Story.findOne({ featureId, name }).exec((err, story) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (story) {
			if (JSON.stringify(story.columns) === JSON.stringify(columns)) {
				return res.status(400).json({
					error: `Story with name "${name}" already exists`,
				});
			} else {
				Story.updateOne(
					{ _id: id },
					{
						name: name,
						columns: columns,
					}
				).exec((err, story) => {
					if (err) {
						return res.status(400).json({
							error: "Something went wrong",
						});
					}

					if (!story) {
						return res.status(400).json({
							error: "Specified story does not exist.",
						});
					}

					return res.json({ updated: story });
				});
			}
		} else {
			Story.updateOne(
				{ _id: id },
				{
					name: name,
					columns: columns,
				}
			).exec((err, story) => {
				if (err) {
					return res.status(400).json({
						error: "Something went wrong",
					});
				}

				if (!story) {
					return res.status(400).json({
						error: "Specified story does not exist.",
					});
				}

				return res.json({ updated: story });
			});
		}
	});
};

exports.updateStoryStatus = (req, res) => {
	const { storyId, status } = req.body;

	if (status === "Closed") {
		Task.find({ storyId }).exec((err, tasks) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			if (tasks) {
				let count = 0;
				tasks.forEach(task => {
					if (task.column !== 3) {
						count += 1;
					}
				});

				if (count === 0) {
					Story.updateOne(
						{ _id: storyId },
						{
							status: status,
						}
					).exec((err, story) => {
						if (err) {
							return res.status(400).json({
								error: "Something went wrong",
							});
						}

						if (!story) {
							return res.status(400).json({
								error: "Specified Story does not exist.",
							});
						}

						return res.json({ allow: true, count: count });
					});
				} else {
					return res.status(200).json({
						allow: false,
						count: count,
					});
				}
			} else {
				Story.updateOne(
					{ _id: storyId },
					{
						status: status,
					}
				).exec((err, story) => {
					if (err) {
						return res.status(400).json({
							error: "Something went wrong",
						});
					}

					if (!story) {
						return res.status(400).json({
							error: "Specified Story does not exist.",
						});
					}

					return res.json({ allow: true, count: 0 });
				});
			}
		});
	} else {
		Story.updateOne(
			{ _id: storyId },
			{
				status: status,
			}
		).exec((err, story) => {
			if (err) {
				return res.status(400).json({
					error: "Something went wrong",
				});
			}

			if (!story) {
				return res.status(400).json({
					error: "Specified Story does not exist.",
				});
			}

			return res.json({ allow: true, count: 0 });
		});
	}
};
