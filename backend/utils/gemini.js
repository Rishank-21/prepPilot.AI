const { GoogleGenAI } = require("@google/genai");

const getGeminiModel = () => process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

async function generateGeminiJson({ model, prompt, schema, maxOutputTokens }) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY?.trim(),
    vertexai: false,
    httpOptions: { timeout: 30000 },
  });
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      maxOutputTokens,
    },
  });

  return JSON.parse(response.text);
}

module.exports = { getGeminiModel, generateGeminiJson };
