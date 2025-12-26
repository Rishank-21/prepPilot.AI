// Install both: npm install groq-sdk @google/generative-ai

const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

// Initialize both AI clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple rate limiting store
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

// Parse JSON response
const cleanAndParseJSON = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch (error) {
    const cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleanedText);
  }
};

// 🆕 Generate content with Groq (Primary)
const generateWithGroq = async (prompt, systemPrompt, maxTokens = 4096) => {
  try {
    console.log("🟢 Trying Groq API...");
    
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
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0].message.content;
    console.log("✅ Groq API Success!");
    return {
      success: true,
      data: cleanAndParseJSON(rawText),
      provider: "groq",
    };
  } catch (error) {
    console.error("❌ Groq API Failed:", error.message);
    throw error;
  }
};

// 🆕 Generate content with Gemini (Fallback)
const generateWithGemini = async (prompt, maxTokens = 2048) => {
  try {
    console.log("🔵 Trying Gemini API (Fallback)...");
    
    // Try multiple Gemini models in order of preference
    const models = [
      "gemini-2.5-flash-lite-preview", // Best free option
      "gemini-1.5-flash",              // Stable fallback
      "gemini-pro",                    // Last resort
    ];

    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`  → Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: maxTokens,
          },
        });

        const result = await model.generateContent(prompt);
        const rawText = result.response.text();
        
        console.log(`✅ Gemini API Success with ${modelName}!`);
        return {
          success: true,
          data: cleanAndParseJSON(rawText),
          provider: `gemini-${modelName}`,
        };
      } catch (modelError) {
        console.error(`  ✗ ${modelName} failed:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }

    // If all models failed
    throw lastError || new Error("All Gemini models failed");
  } catch (error) {
    console.error("❌ Gemini API Failed:", error.message);
    throw error;
  }
};

// 🆕 Smart AI Generator with automatic fallback
const generateWithFallback = async (prompt, systemPrompt, maxTokens = 4096) => {
  let primaryError = null;
  let fallbackError = null;

  // Try Groq first (free & fast)
  if (process.env.GROQ_API_KEY) {
    try {
      return await generateWithGroq(prompt, systemPrompt, maxTokens);
    } catch (error) {
      primaryError = error;
      console.log("⚠️ Groq failed, trying Gemini...");
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini(prompt, maxTokens);
    } catch (error) {
      fallbackError = error;
    }
  }

  // Both failed
  throw new Error(
    `Both AI providers failed. Groq: ${primaryError?.message || "Not configured"}. Gemini: ${fallbackError?.message || "Not configured"}`
  );
};

// ✅ Generate interview questions with fallback
const generateInterviewQuestions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Rate limiting: 5 requests per hour per user
    if (isRateLimited(userId, 5)) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        limit: "5 sessions per hour",
      });
    }

    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        requiredFields: [
          "role",
          "experience",
          "topicsToFocus",
          "numberOfQuestions",
        ],
      });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const systemPrompt =
      "You are an expert technical interview question generator. Always respond with valid JSON only. No extra text or explanations.";

    // Use fallback system
    const result = await generateWithFallback(prompt, systemPrompt, 4096);

    res.status(200).json({
      success: true,
      data: result.data,
      provider: result.provider, // Shows which AI was used
    });
  } catch (error) {
    console.error("❌ All AI providers failed:", error.message);

    // Check for specific error types
    if (error.message.includes("rate_limit") || error.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "API rate limit reached. Please try again in a few minutes.",
        error: "RATE_LIMIT_EXCEEDED",
      });
    }

    if (
      error.message.includes("401") ||
      error.message.includes("authentication") ||
      error.message.includes("API key")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid API keys. Please check your configuration.",
        error: "INVALID_API_KEY",
      });
    }

    if (error.message.includes("quota")) {
      return res.status(429).json({
        success: false,
        message: "API quota exceeded for all providers. Please try again later.",
        error: "QUOTA_EXCEEDED",
        suggestion: "Consider upgrading to a paid plan or wait for quota reset.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate questions with all AI providers",
      error: error.message,
    });
  }
};

// ✅ Generate concept explanation with fallback
const generateConceptExplanation = async (req, res) => {
  try {
    const userId = req.user._id;

    // Rate limiting: 10 requests per hour per user
    if (isRateLimited(userId, 10)) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        limit: "10 explanations per hour",
      });
    }

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: question",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const systemPrompt =
      "You are an expert technical interviewer explaining concepts to beginners. Always respond with valid JSON only.";

    // Use fallback system
    const result = await generateWithFallback(prompt, systemPrompt, 2048);

    res.status(200).json({
      success: true,
      data: result.data,
      provider: result.provider, // Shows which AI was used
    });
  } catch (error) {
    console.error("❌ All AI providers failed:", error.message);

    if (error.message.includes("rate_limit") || error.message.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "API rate limit reached. Please try again in a few minutes.",
        error: "RATE_LIMIT_EXCEEDED",
      });
    }

    if (
      error.message.includes("401") ||
      error.message.includes("authentication") ||
      error.message.includes("API key")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid API keys. Please check your configuration.",
        error: "INVALID_API_KEY",
      });
    }

    if (error.message.includes("quota")) {
      return res.status(429).json({
        success: false,
        message: "API quota exceeded for all providers. Please try again later.",
        error: "QUOTA_EXCEEDED",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate explanation with all AI providers",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };