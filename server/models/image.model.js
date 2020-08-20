const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},

	img: { data: Buffer },

	imageName: {
		type: String,
		default: "none",
		required: true,
	},

	imageData: {
		type: String,
		required: true,
	},
});

module.exports = model("Image", ImageSchema);
