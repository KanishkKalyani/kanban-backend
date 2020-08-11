const { model, Schema } = require("mongoose");

const ProjectSchema = new Schema(
	{
		managerId: {
			type: String,
			required: true,
		},
		employee: [
			{
				id: String,
				name: String,
			},
		],
		name: {
			type: String,
			trim: true,
			required: true,
		},
		description: {
			type: String,
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

module.exports = model("Project", ProjectSchema);
