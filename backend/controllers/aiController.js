
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test Gemini connection on startup (optional)
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Say hello!");
      console.log("✅ Gemini connected successfully");
    } catch (err) {
      console.error("❌ Gemini connection test failed:", err.message);
    }
  })();
}

// Utility to clean and parse the AI JSON output
const cleanAndParseJSON = (rawText) => {
  try {
    const cleanedText = rawText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("❌ JSON Parse Error. Raw text:", rawText);
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

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({ message: "API configuration error. Please contact support." });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    // ✅ Try with gemini-1.5-flash first (more stable)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🔄 Generating questions for role:", role);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log("✅ Received response from Gemini");

    const data = cleanAndParseJSON(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ generateInterviewQuestions Error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: "Failed to generate questions. Please try again.", 
      error: error.message 
    });
  }
};

// ✅ Generate concept explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({ message: "API configuration error. Please contact support." });
    }

    const prompt = conceptExplainPrompt(question);

    // ✅ Use gemini-1.5-flash (more stable)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🔄 Generating explanation for question:", question.substring(0, 50) + "...");
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log("✅ Received explanation from Gemini");

    const data = cleanAndParseJSON(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ generateConceptExplanation Error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: "Failed to generate explanation. Please try again.", 
      error: error.message 
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };

