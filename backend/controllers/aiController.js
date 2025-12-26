// GROQ AI CONTROLLER - Fixed JSON Parsing
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
  for (const [key] of requestCounts.entries()) {
    const keyTime = parseInt(key.split(':')[1]) * 3600000;
    if (now - keyTime > 3600000) {
      requestCounts.delete(key);
    }
  }
}, 3600000);

// 🆕 Advanced JSON parser with auto-fix
const cleanAndParseJSON = (rawText) => {
  console.log("📝 Parsing AI response...");
  
  try {
    // Try direct parse first
    return JSON.parse(rawText);
  } catch (error) {
    console.log("⚠️ Direct parse failed, trying cleanup...");
    
    try {
      // Remove markdown code blocks
      let cleaned = rawText
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .trim();

      // Try parsing cleaned version
      return JSON.parse(cleaned);
    } catch (secondError) {
      console.log("⚠️ Standard cleanup failed, trying advanced fixes...");
      
      try {
        // Advanced cleanup for malformed JSON
        let fixed = rawText
          .replace(/```json\n?/gi, "")
          .replace(/```\n?/g, "")
          .trim();

        // Fix common JSON issues
        // 1. Remove trailing commas before closing brackets
        fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
        
        // 2. Ensure array has closing bracket if missing
        if (fixed.startsWith('[') && !fixed.endsWith(']')) {
          // Find last complete object
          const lastBraceIndex = fixed.lastIndexOf('}');
          if (lastBraceIndex !== -1) {
            fixed = fixed.substring(0, lastBraceIndex + 1) + '\n]';
          }
        }
        
        // 3. Ensure object has closing brace if missing
        if (fixed.startsWith('{') && !fixed.endsWith('}')) {
          fixed = fixed + '\n}';
        }

        // 4. Fix escaped newlines in code blocks
        fixed = fixed.replace(/\\n/g, '\\\\n');

        return JSON.parse(fixed);
      } catch (finalError) {
        console.error("❌ All parsing attempts failed");
        console.error("Original response (first 1000 chars):", rawText.substring(0, 1000));
        throw new Error("Failed to parse AI response as valid JSON");
      }
    }
  }
};

// Generate content with Groq (WITHOUT strict JSON mode)
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
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Lower temperature for more consistent JSON
      max_tokens: maxTokens,
      // 🆕 REMOVED: response_format - let it generate freely, we'll parse it
    });

    const rawText = completion.choices[0].message.content;
    console.log("✅ [GROQ] Response received, parsing...");

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
        retryAfter: 3600,
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

    // 🆕 Improved system prompt for better JSON output
    const systemPrompt = `You are an expert technical interview question generator.

CRITICAL INSTRUCTIONS:
1. Generate EXACTLY ${numberOfQuestions} interview questions
2. Output MUST be a valid JSON array
3. Each question must have "question" and "answer" fields
4. Do NOT add any text before or after the JSON
5. Ensure all JSON brackets are properly closed
6. Escape all special characters in answers (quotes, newlines, etc.)

Example format:
[
  {
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces."
  }
]`;

    const prompt = `Generate ${numberOfQuestions} interview questions for:
Role: ${role}
Experience: ${experience} years
Topics: ${topicsToFocus}

Return ONLY a valid JSON array. No explanations, no markdown, just pure JSON.`;

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
        hint: "The AI generated malformed JSON. Retrying should work.",
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

    // 🆕 Improved system prompt
    const systemPrompt = `You are an expert technical interviewer explaining concepts to beginners.

CRITICAL INSTRUCTIONS:
1. Output MUST be a valid JSON object
2. Must have "title" and "explanation" fields
3. Do NOT add any text before or after the JSON
4. Ensure all JSON brackets are properly closed
5. Escape all special characters properly

Example format:
{
  "title": "Understanding Closures",
  "explanation": "A closure is a function that has access to variables in its outer scope."
}`;

    const prompt = `Explain this interview question in detail:
"${question}"

Provide a beginner-friendly explanation with examples if needed.
Return ONLY a valid JSON object. No markdown, just pure JSON.`;

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