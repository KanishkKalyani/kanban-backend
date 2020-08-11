const express = require("express");
const router = express.Router();
const {
	allStories,
	addStory,
	deleteStory,
	updateStory,
	updateStoryStatus,
} = require("../controllers/stories.controllers");

router.get("/all-stories/:featureId", allStories);

router.post("/add-story", addStory);

router.delete("/delete-story/:id", deleteStory);

router.put("/update-story", updateStory);

router.put("/update-story-status", updateStoryStatus);

module.exports = router;
