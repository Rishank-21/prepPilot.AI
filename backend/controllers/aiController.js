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
  console.log("📊 Response length:", rawText.length, "characters");
  
  try {
    // Try direct parse first
    const parsed = JSON.parse(rawText);
    console.log("✅ Direct parse successful!");
    return parsed;
  } catch (error) {
    console.log("⚠️ Direct parse failed:", error.message);
    
    try {
      // Remove markdown code blocks
      let cleaned = rawText
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .trim();

      // Try parsing cleaned version
      const parsed = JSON.parse(cleaned);
      console.log("✅ Cleanup parse successful!");
      return parsed;
    } catch (secondError) {
      console.log("⚠️ Standard cleanup failed:", secondError.message);
      
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
          console.log("⚠️ Missing closing bracket, attempting fix...");
          // Find last complete object
          const lastBraceIndex = fixed.lastIndexOf('}');
          if (lastBraceIndex !== -1) {
            fixed = fixed.substring(0, lastBraceIndex + 1) + '\n]';
            console.log("🔧 Added closing bracket");
          }
        }
        
        // 3. Ensure object has closing brace if missing
        if (fixed.startsWith('{') && !fixed.endsWith('}')) {
          console.log("⚠️ Missing closing brace, attempting fix...");
          fixed = fixed + '\n}';
          console.log("🔧 Added closing brace");
        }

        const parsed = JSON.parse(fixed);
        console.log("✅ Advanced fix successful!");
        return parsed;
      } catch (finalError) {
        console.error("❌ All parsing attempts failed");
        console.error("Parse error:", finalError.message);
        console.error("Response length:", rawText.length);
        console.error("First 500 chars:", rawText.substring(0, 500));
        console.error("Last 500 chars:", rawText.substring(Math.max(0, rawText.length - 500)));
        throw new Error("Failed to parse AI response as valid JSON");
      }
    }
  }
};

// 🆕 Generate with automatic retry on parse failures
const generateWithRetry = async (prompt, systemPrompt, maxTokens, maxRetries = 2) => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      return await generateWithGroq(prompt, systemPrompt, maxTokens);
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      // Don't retry on authentication errors
      if (error.message.includes("401") || error.message.includes("API key")) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = 1000 * attempt; // 1s, 2s, 3s...
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
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
      temperature: 0.3, // Even lower for more consistent JSON
      max_tokens: maxTokens,
      top_p: 0.9, // Add top_p for better consistency
    });

    const rawText = completion.choices[0].message.content;
    console.log("✅ [GROQ] Response received");
    console.log("📊 Response size:", rawText.length, "characters");

    const parsedData = cleanAndParseJSON(rawText);
    
    // Validate the parsed data
    if (Array.isArray(parsedData)) {
      console.log("✅ Parsed as array with", parsedData.length, "items");
    } else if (typeof parsedData === 'object') {
      console.log("✅ Parsed as object with keys:", Object.keys(parsedData).join(', '));
    }

    return {
      success: true,
      data: parsedData,
      provider: "groq",
      model: "llama-3.3-70b-versatile",
    };
  } catch (error) {
    console.error("❌ [GROQ] Error:", error.message);
    throw error;
  }
};

// 🆕 Enhanced parser specifically for explanations
const parseExplanationResponse = (rawText) => {
  console.log("📝 Parsing explanation response...");
  console.log("📊 Response length:", rawText.length, "characters");
  
  try {
    // Try direct parse first
    const parsed = JSON.parse(rawText);
    if (parsed.title && parsed.explanation) {
      console.log("✅ Direct parse successful!");
      return parsed;
    }
    throw new Error("Missing required fields");
  } catch (error) {
    console.log("⚠️ Direct parse failed:", error.message);
  }

  try {
    // Remove markdown code blocks
    let cleaned = rawText
      .replace(/```javascript\n?/gi, "```javascript\n")
      .replace(/```js\n?/gi, "```javascript\n")
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();

    // Try parsing cleaned version
    const parsed = JSON.parse(cleaned);
    console.log("✅ Cleanup parse successful!");
    return parsed;
  } catch (secondError) {
    console.log("⚠️ Standard cleanup failed:", secondError.message);
    
    try {
      // Advanced cleanup for malformed JSON
      let fixed = rawText
        .replace(/```javascript\n?/gi, "```javascript\n")
        .replace(/```js\n?/gi, "```javascript\n")
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .trim();

      // Fix common JSON issues
      // 1. Remove trailing commas before closing brackets
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
      
      // 2. Ensure array has closing bracket if missing
      if (fixed.startsWith('[') && !fixed.endsWith(']')) {
        console.log("⚠️ Missing closing bracket, attempting fix...");
        // Find last complete object
        const lastBraceIndex = fixed.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
          fixed = fixed.substring(0, lastBraceIndex + 1) + '\n]';
          console.log("🔧 Added closing bracket");
        }
      }
      
      // 3. Ensure object has closing brace if missing
      if (fixed.startsWith('{') && !fixed.endsWith('}')) {
        console.log("⚠️ Missing closing brace, attempting fix...");
        fixed = fixed + '\n}';
        console.log("🔧 Added closing brace");
      }

      const parsed = JSON.parse(fixed);
      console.log("✅ Advanced fix successful!");
      return parsed;
    } catch (finalError) {
      console.error("❌ All parsing attempts failed");
      console.error("Parse error:", finalError.message);
      console.error("Response length:", rawText.length);
      console.error("First 500 chars:", rawText.substring(0, 500));
      console.error("Last 500 chars:", rawText.substring(Math.max(0, rawText.length - 500)));
      throw new Error("Failed to parse AI response as valid JSON");
    }
  }
};

// Generate content with Groq (WITHOUT strict JSON mode)
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

    // Use your original prompt
    const prompt = conceptExplainPrompt(question);

    // Simple system prompt
    const systemPrompt = "You are a helpful AI assistant that explains technical concepts. Always return valid JSON.";

    // Generate with Groq (with retry logic)
    const result = await generateWithRetry(prompt, systemPrompt, 2048, 3);

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

    // Use your original prompt (already perfect!)
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    // Simple system prompt - just tell AI what it is
    const systemPrompt = "You are a helpful AI assistant that generates technical interview questions. Always return valid JSON.";

    // Generate with Groq (with retry logic)
    const result = await generateWithRetry(prompt, systemPrompt, 4096, 3);

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

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};