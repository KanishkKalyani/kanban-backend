const { model, Schema } = require("mongoose");

const StorySchema = new Schema(
	{
		featureId: {
			type: String,
			required: true,
		},
		projectId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			trim: true,
			required: false,
			default: "New Story",
		},
		status: {
			type: String,
			default: "New",
		},
		columns: {
			type: [{ type: String }],
			default: ["Initial State", "In Progress", "Debugging", "Completed"],
		},
		time: {
			type: String,
			default: new Date()
				.toLocaleString()
				.replace(",", "")
				.replace(/:.. /, " "),
		},
	},
	{ timestamps: true }
);

module.exports = model("stories", StorySchema);
