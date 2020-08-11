const { model, Schema } = require("mongoose");

const TaskSchema = new Schema(
	{
		storyId: {
			type: String,
			required: true,
		},
		featureId: {
			type: String,
			required: true,
		},
		projectId: {
			type: String,
			required: true,
		},
		column: {
			type: Number,
			required: false,
			default: 0,
		},
		index: {
			type: Number,
			required: false,
			default: 0,
		},
		name: {
			type: String,
			trim: true,
			required: false,
			default: "New Task",
		},
		employeeId: {
			id: String,
			default: "",
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

module.exports = model("Task", TaskSchema);
