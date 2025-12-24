const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);

module.exports = router;
