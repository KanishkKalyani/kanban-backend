const multer = require("multer");
const Image = require("../models/image.model");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: "./uploads",
	filename: function (__, file, callback) {
		callback(null, "IMAGE-" + Date.now() + file.originalname);
	},
});

const fileFilter = (__, file, callback) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
}).single("profile-image");

exports.addImage = (req, res) => {
	const userId = req.params.userId;

	return upload(req, res, err => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}

		const img = {
			data: fs.readFileSync(req.file.path),
		};

		Image.updateOne(
			{ userId: userId },
			{
				userId: req.params.userId,
				img: img,
				imageName: req.file.originalname,
				imageData: req.file.path,
			},
			{ upsert: true },
			(err, result) => {
				if (err) {
					return res.status(400).json({
						error: "Something went wrong",
					});
				}

				return res.json({ updated: result });
			}
		);
	});
};

exports.getImage = (req, res) => {
	const userId = req.params.userId;

	Image.find({ userId }).exec((err, img) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}

		if (!img) {
			return res.json({ image: undefined });
		}

		return res.json({ image: img });
	});
};

exports.deleteImage = (req, res) => {
	const userId = req.params.userId;

	Image.findOneAndDelete({ userId }).exec((err, img) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}

		if (!img) {
			return res.status(400).json({
				error: "Specified Image does not exist.",
			});
		}

		return res.json({ deleted: img });
	});
};
