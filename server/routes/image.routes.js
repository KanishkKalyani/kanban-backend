const express = require("express");
const {
	addImage,
	getImage,
	deleteImage,
} = require("../controllers/image.controllers");
const router = express.Router();

router.post("/image-upload/:userId", addImage);
router.get("/profile-image/:userId", getImage);
router.delete("/delete-image/:userId", deleteImage);

module.exports = router;
