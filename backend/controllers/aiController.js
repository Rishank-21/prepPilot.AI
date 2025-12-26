const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Utility to clean and parse the AI JSON output
const cleanAndParseJSON = (rawText) => {
  try {
    const cleanedText = rawText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error("❌ JSON Parse Error:", parseError.message);
    console.error("Raw text:", rawText);
    throw new Error("Failed to parse AI response as JSON");
  }
};

// ✅ Generate interview questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const data = cleanAndParseJSON(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ generateInterviewQuestions Error:", error);
    res
      .status(500)
      .json({ message: "Failed to generate questions", error: error.message });
  }
};

// ✅ Generate concept explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const data = cleanAndParseJSON(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ generateConceptExplanation Error:", error);
    res
      .status(500)
      .json({
        message: "Failed to generate explanation",
        error: error.message,
      });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
