// GROQ-ONLY VERSION - Simple & Working
// Install: npm install groq-sdk

const Groq = require("groq-sdk");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("✅ Groq AI Controller initialized");

// Rate limiting
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

// Clean rate limit cache every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    const keyTime = parseInt(key.split(':')[1]) * 3600000;
    if (now - keyTime > 3600000) {
      requestCounts.delete(key);
    }
  }
}, 3600000);

// JSON parser with robust error handling
const cleanAndParseJSON = (rawText) => {
  try {
    // Try direct parse first
    return JSON.parse(rawText);
  } catch (error) {
    try {
      // Clean markdown formatting
      const cleanedText = rawText
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleanedText);
    } catch (secondError) {
      console.error("❌ JSON Parse Error");
      console.error("Raw response:", rawText.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }
  }
};

// Generate content with Groq
const generateWithGroq = async (prompt, systemPrompt, maxTokens = 4096) => {
  console.log("🟢 [GROQ] Generating content...");
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Best free model
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: "json_object" }, // Force JSON
    });

    const rawText = completion.choices[0].message.content;
    console.log("✅ [GROQ] Success!");

    return {
      success: true,
      data: cleanAndParseJSON(rawText),
      provider: "groq",
      model: "llama-3.3-70b-versatile",
    };
  } catch (error) {
    console.error("❌ [GROQ] Error:", error.message);
    throw error;
  }
};

// ✅ Generate interview questions
const generateInterviewQuestions = async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 Generate Interview Questions Request");
  console.log("=".repeat(60));

  try {
    const userId = req.user._id;

    // Rate limiting: 5 sessions per hour
    if (isRateLimited(userId, 5)) {
      console.log("⛔ Rate limit hit for user:", userId);
      return res.status(429).json({
        success: false,
        message: "Too many requests. You can create 5 sessions per hour.",
        error: "RATE_LIMIT_EXCEEDED",
        retryAfter: 3600, // seconds
      });
    }

    // Validate input
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    
    console.log("📋 Request params:", {
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    });

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        requiredFields: ["role", "experience", "topicsToFocus", "numberOfQuestions"],
      });
    }

    // Generate prompt
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const systemPrompt = `You are an expert technical interview question generator. 
Generate exactly ${numberOfQuestions} interview questions for a ${role} position with ${experience} years of experience.
Focus on: ${topicsToFocus}
Respond ONLY with valid JSON in this exact format:
[
  {
    "question": "Question text here?",
    "answer": "Detailed answer here."
  }
]
Do not include any text outside the JSON array.`;

    // Generate with Groq
    const result = await generateWithGroq(prompt, systemPrompt, 4096);

    console.log("✅ SUCCESS - Questions generated");
    console.log("=".repeat(60) + "\n");

    return res.status(200).json({
      success: true,
      data: result.data,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error("💥 ERROR:", error.message);
    console.log("=".repeat(60) + "\n");

    // Handle Groq rate limits
    if (error.message.includes("rate_limit") || error.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "API rate limit reached. Please wait a moment and try again.",
        error: "API_RATE_LIMIT",
      });
    }

    // Handle authentication errors
    if (
      error.message.includes("401") ||
      error.message.includes("authentication") ||
      error.message.includes("API key")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key. Please check your Groq API configuration.",
        error: "INVALID_API_KEY",
      });
    }

    // Handle JSON parsing errors
    if (error.message.includes("parse") || error.message.includes("JSON")) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response. Please try again.",
        error: "PARSE_ERROR",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Failed to generate questions. Please try again.",
      error: error.message,
    });
  }
};

// ✅ Generate concept explanation
const generateConceptExplanation = async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 Generate Concept Explanation Request");
  console.log("=".repeat(60));

  try {
    const userId = req.user._id;

    // Rate limiting: 10 explanations per hour
    if (isRateLimited(userId, 10)) {
      console.log("⛔ Rate limit hit for user:", userId);
      return res.status(429).json({
        success: false,
        message: "Too many requests. You can generate 10 explanations per hour.",
        error: "RATE_LIMIT_EXCEEDED",
        retryAfter: 3600,
      });
    }

    // Validate input
    const { question } = req.body;
    console.log("📋 Question:", question);

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: question",
      });
    }

    // Generate prompt
    const prompt = conceptExplainPrompt(question);

    const systemPrompt = `You are an expert technical interviewer explaining concepts to beginners.
Explain the following interview question in depth with examples.
Respond ONLY with valid JSON in this exact format:
{
  "title": "Short descriptive title",
  "explanation": "Detailed explanation with examples and code if needed"
}
Do not include any text outside the JSON object.`;

    // Generate with Groq
    const result = await generateWithGroq(prompt, systemPrompt, 2048);

    console.log("✅ SUCCESS - Explanation generated");
    console.log("=".repeat(60) + "\n");

    return res.status(200).json({
      success: true,
      data: result.data,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error("💥 ERROR:", error.message);
    console.log("=".repeat(60) + "\n");

    // Handle rate limits
    if (error.message.includes("rate_limit") || error.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "API rate limit reached. Please wait a moment and try again.",
        error: "API_RATE_LIMIT",
      });
    }

    // Handle authentication errors
    if (
      error.message.includes("401") ||
      error.message.includes("authentication") ||
      error.message.includes("API key")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key. Please check your Groq API configuration.",
        error: "INVALID_API_KEY",
      });
    }

    // Handle JSON parsing errors
    if (error.message.includes("parse") || error.message.includes("JSON")) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response. Please try again.",
        error: "PARSE_ERROR",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Failed to generate explanation. Please try again.",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};