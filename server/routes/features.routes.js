const express = require("express");
const router = express.Router();
const {
	allFeatures,
	addFeature,
	deleteFeature,
	updateFeature,
	updateFeatureEmployee,
	updateFeatureStatus,
} = require("../controllers/features.controllers");

router.get("/all-features/:projectId", allFeatures);

router.post("/add-feature", addFeature);

router.delete("/delete-feature/:id", deleteFeature);

router.put("/update-feature", updateFeature);

router.put("/update-feature-emp", updateFeatureEmployee);

router.put("/update-feature-status", updateFeatureStatus);

module.exports = router;
