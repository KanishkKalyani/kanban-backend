const { model, Schema } = require("mongoose");

const FeatureSchema = new Schema(
	{
		projectId: {
			type: String,
			required: true,
		},
		managerId: {
			type: String,
			required: true,
		},
		employeeId: {
			type: String,
			required: true,
		},
		employeeName: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			trim: true,
			required: false,
			default: "",
		},
		status: {
			type: String,
			default: "New",
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

module.exports = model("Feature", FeatureSchema);
