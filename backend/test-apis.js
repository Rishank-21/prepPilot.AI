// test-apis.js - FIXED VERSION
require('dotenv').config();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAPIs() {
  console.log("\n🧪 Testing API Keys...\n");
  
  // Test Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: "Say hello" }],
        model: "llama-3.3-70b-versatile",
        max_tokens: 10,
      });
      console.log("✅ GROQ API Working!");
      console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
      console.error("❌ GROQ API Failed:", error.message);
    }
  } else {
    console.log("⚠️ GROQ_API_KEY not found");
  }
  
  console.log("\n");
  
  // Test Gemini with CORRECT models
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try multiple working models
    const modelsToTry = [
      "gemini-pro",              // Most stable
      "gemini-1.5-pro",          // Also stable
      "gemini-2.0-flash-exp",    // Experimental but available
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        console.log(`✅ ${modelName} Working!`);
        console.log("Response:", result.response.text());
        break; // Success, no need to test other models
      } catch (error) {
        console.error(`❌ ${modelName} Failed:`, error.message);
      }
    }
  } else {
    console.log("⚠️ GEMINI_API_KEY not found");
  }
}

testAPIs();