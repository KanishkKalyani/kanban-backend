const Feature = require("../models/features.model");
const Story = require("../models/stories.model");
const Task = require("../models/tasks.model");

exports.addFeature = (req, res) => {
	const { projectId, name, managerId, employeeId, employeeName } = req.body;

	const newFeature = new Feature({
		projectId,
		name,
		managerId,
		employeeId,
		employeeName,
	});

	Feature.findOne({ projectId, name }).exec((err, feature) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (feature) {
			return res.status(400).json({
				error: `Feature with name "${feature.name}" already exists`,
			});
		}

		newFeature.save((err, featureData) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			res.json({
				message: `Hey, ${featureData.name} feature saved in DB`,
				feature: featureData,
			});
		});
	});
};

exports.allFeatures = (req, res) => {
	const { projectId } = req.params;

	Feature.find({ projectId }).exec((err, allfeatures) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		return res.json({ features: allfeatures });
	});
};

exports.deleteFeature = (req, res) => {
	const { id } = req.params;

	Task.deleteMany({ featureId: id }).exec((err, __) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}
	});

	Story.deleteMany({ featureId: id }).exec((err, __) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}
	});

	Feature.findOneAndDelete({ _id: id }).exec((err, feature) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!feature) {
			return res.status(400).json({
				error: "Specified feature does not exist.",
			});
		}

		return res.json({ deleted: feature });
	});
};

exports.updateFeature = (req, res) => {
	const { projectId, id, name } = req.body;

	Feature.findOne({ projectId, name }).exec((err, feature) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		if (feature) {
			return res.status(400).json({
				error: `Feature with name "${name}" already exists`,
			});
		} else {
			Feature.updateOne(
				{ _id: id },
				{
					name: name,
				}
			).exec((err, feature) => {
				if (err) {
					return res.status(400).json({
						error: "Something went wrong",
					});
				}

				if (!feature) {
					return res.status(400).json({
						error: "Specified feature does not exist.",
					});
				}

				return res.json({ updated: feature });
			});
		}
	});
};

exports.updateFeatureEmployee = (req, res) => {
	const { id, employeeId, employeeName } = req.body;

	Feature.updateOne(
		{ _id: id },
		{
			employeeId: employeeId,
			employeeName: employeeName,
		}
	).exec((err, feature) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!feature) {
			return res.status(400).json({
				error: "Specified feature does not exist.",
			});
		}

		return res.json({ updated: feature });
	});
};

exports.updateFeatureStatus = (req, res) => {
	const { featureId, status } = req.body;

	if (status === "Closed") {
		Story.find({ featureId }).exec((err, stories) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			if (stories) {
				let count = 0;
				stories.map(story => {
					if (story.status !== "Closed") {
						count += 1;
					}
				});

				if (count === 0) {
					Feature.updateOne(
						{ _id: featureId },
						{
							status: status,
						}
					).exec((err, feature) => {
						if (err) {
							return res.status(400).json({
								error: "Something went wrong",
							});
						}

						if (!feature) {
							return res.status(400).json({
								error: "Specified feature does not exist.",
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
				Feature.updateOne(
					{ _id: featureId },
					{
						status: status,
					}
				).exec((err, feature) => {
					if (err) {
						return res.status(400).json({
							error: "Something went wrong",
						});
					}

					if (!feature) {
						return res.status(400).json({
							error: "Specified feature does not exist.",
						});
					}

					return res.json({ allow: true, count: 0 });
				});
			}
		});
	} else {
		Feature.updateOne(
			{ _id: featureId },
			{
				status: status,
			}
		).exec((err, feature) => {
			if (err) {
				return res.status(400).json({
					error: "Something went wrong",
				});
			}

			if (!feature) {
				return res.status(400).json({
					error: "Specified feature does not exist.",
				});
			}

			return res.json({ allow: true, count: 0 });
		});
	}
};
