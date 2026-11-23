require("dotenv").config({ quiet: true });

const { Type } = require("@google/genai");
const { getGeminiModel, generateGeminiJson } = require("./utils/gemini");

async function testGemini() {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.error("GEMINI_API_KEY is missing.");
    process.exitCode = 1;
    return;
  }

  const model = getGeminiModel();
  try {
    const result = await generateGeminiJson({
      model,
      prompt: 'Return a JSON object with "status" set to "ok".',
      schema: {
        type: Type.OBJECT,
        properties: { status: { type: Type.STRING } },
        required: ["status"],
      },
      maxOutputTokens: 1024,
    });
    if (result.status !== "ok") throw new Error("Unexpected response");
    console.log(`Gemini generation succeeded with ${model}.`);
  } catch (error) {
    console.error("Gemini generation failed (%s).", error.status || error.name);
    process.exitCode = 1;
  }
}

testGemini();
