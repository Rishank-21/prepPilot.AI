const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple rate limiting store (use Redis in production)
const requestCounts = new Map();

const isRateLimited = (userId, limit = 5, windowMs = 3600000) => {
  const now = Date.now();
  const key = `${userId}:${Math.floor(now / windowMs)}`;

  if (!requestCounts.has(key)) {
    requestCounts.set(key, 0);
  }

  const count = requestCounts.get(key);
  if (count >= limit) {
    return true;
  }

  requestCounts.set(key, count + 1);
  return false;
};

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

// 🆕 Enhanced error handler for Gemini API errors
const handleGeminiError = (error, res) => {
  console.error("❌ Gemini API Error:", error.message);

  // Quota exceeded error
  if (error.message.includes("429") || error.message.includes("quota")) {
    // Extract retry time if available
    const retryMatch = error.message.match(/retry in ([\d.]+)s/);
    const retryAfter = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

    return res.status(429).json({
      success: false,
      message: "API quota exceeded. Please try again later.",
      error: "QUOTA_EXCEEDED",
      retryAfter: retryAfter,
      suggestions: [
        "Wait a few minutes and try again",
        "Consider upgrading your Google AI plan",
        "Check your usage at https://ai.dev/usage"
      ]
    });
  }

  // Rate limit error
  if (error.message.includes("rate limit")) {
    return res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Please slow down your requests.",
      error: "RATE_LIMIT_EXCEEDED"
    });
  }

  // Invalid API key
  if (error.message.includes("API key") || error.message.includes("401")) {
    return res.status(401).json({
      success: false,
      message: "Invalid API key. Please check your configuration.",
      error: "INVALID_API_KEY"
    });
  }

  // Generic error
  return res.status(500).json({
    success: false,
    message: "Failed to generate content. Please try again.",
    error: error.message
  });
};

// ✅ Generate interview questions with retry logic
const generateInterviewQuestions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Rate limiting: 5 requests per hour per user
    if (isRateLimited(userId, 5)) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        error: "USER_RATE_LIMIT",
        limit: "5 sessions per hour"
      });
    }

    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields",
        requiredFields: ["role", "experience", "topicsToFocus", "numberOfQuestions"]
      });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    // 🆕 Try gemini-1.5-flash first (more stable free tier)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const data = cleanAndParseJSON(rawText);
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};

// ✅ Generate concept explanation with improved error handling
const generateConceptExplanation = async (req, res) => {
  try {
    const userId = req.user._id;

    // Rate limiting: 10 requests per hour per user
    if (isRateLimited(userId, 10)) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        error: "USER_RATE_LIMIT",
        limit: "10 explanations per hour"
      });
    }

    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required field: question" 
      });
    }

    const prompt = conceptExplainPrompt(question);

    // 🆕 Use gemini-1.5-flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const data = cleanAndParseJSON(rawText);
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };