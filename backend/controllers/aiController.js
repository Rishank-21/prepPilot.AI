const { Type } = require("@google/genai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");
const { getGeminiModel, generateGeminiJson } = require("../utils/gemini");

const hourMs = 60 * 60 * 1000;
const requestCounts = new Map();

setInterval(() => {
  const currentHour = Math.floor(Date.now() / hourMs);
  for (const [key, { hour }] of requestCounts) {
    if (hour < currentHour) requestCounts.delete(key);
  }
}, hourMs).unref();

function reserveRequest(userId, action, limit) {
  const key = `${userId}:${action}`;
  const hour = Math.floor(Date.now() / hourMs);
  const previous = requestCounts.get(key);
  const count = previous?.hour === hour ? previous.count : 0;
  if (count >= limit) return Math.ceil(((hour + 1) * hourMs - Date.now()) / 1000);

  requestCounts.set(key, { hour, count: count + 1 });
  return 0;
}

const explanationSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    explanation: { type: Type.STRING },
  },
  required: ["title", "explanation"],
};

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    answer: { type: Type.STRING },
  },
  required: ["question", "answer"],
};

const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const replyWithError = (res, status, message, error) =>
  res.status(status).json({ success: false, message, error });

async function generate(req, res, { action, limit, prompt, schema, validate, maxOutputTokens }) {
  const unavailable = () => replyWithError(
    res, 503, "AI generation is temporarily unavailable. You can still use saved sessions.", "AI_UNAVAILABLE"
  );

  if (!process.env.GEMINI_API_KEY?.trim()) return unavailable();
  const retryAfter = reserveRequest(req.user._id, action, limit);
  if (retryAfter) {
    return res.status(429).set("Retry-After", String(retryAfter)).json({
      success: false,
      message: `You can generate ${limit} sets of ${action} per hour. Please try again later.`,
      error: "RATE_LIMIT_EXCEEDED",
      retryAfter,
    });
  }

  const model = getGeminiModel();
  try {
    const data = await generateGeminiJson({ model, prompt, schema, maxOutputTokens });
    if (!validate(data)) {
      return replyWithError(res, 502, "AI returned an incomplete result. Please try again.", "INVALID_AI_RESPONSE");
    }
    return res.json({ success: true, data, provider: "gemini", model });
  } catch (error) {
    console.error("Gemini %s failed (%s).", action, error.status || error.name);
    if (error.status === 429) {
      return replyWithError(res, 429, "AI usage limit reached. Please wait and try again.", "API_RATE_LIMIT");
    }
    if ([400, 401, 403, 404].includes(error.status)) return unavailable();
    if (error instanceof SyntaxError) {
      return replyWithError(res, 502, "AI returned an unreadable result. Please try again.", "INVALID_AI_RESPONSE");
    }
    return replyWithError(res, 502, "AI generation failed. Please try again.", "AI_REQUEST_FAILED");
  }
}

async function generateInterviewQuestions(req, res) {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body ?? {};
  const years = Number(experience);
  const count = Number(numberOfQuestions);
  const hasExperience = typeof experience === "number" || nonEmpty(experience);
  const hasCount = typeof numberOfQuestions === "number" || nonEmpty(numberOfQuestions);

  if (!nonEmpty(role) || !nonEmpty(topicsToFocus) || !hasExperience
      || !Number.isFinite(years) || years < 0 || !hasCount
      || !Number.isInteger(count) || count < 1 || count > 20) {
    return replyWithError(res, 400, "Enter a role, topics, valid years of experience, and 1–20 questions.", "INVALID_INPUT");
  }

  return generate(req, res, {
    action: "questions",
    limit: 5,
    prompt: questionAnswerPrompt(role.trim(), years, topicsToFocus.trim(), count),
    schema: { type: Type.ARRAY, items: questionSchema, minItems: String(count), maxItems: String(count) },
    validate: (data) => Array.isArray(data) && data.length === count
      && data.every((item) => nonEmpty(item?.question) && nonEmpty(item?.answer)),
    maxOutputTokens: 8192,
  });
}

async function generateConceptExplanation(req, res) {
  const { question } = req.body ?? {};
  if (!nonEmpty(question)) {
    return replyWithError(res, 400, "Enter a question to explain.", "INVALID_INPUT");
  }

  return generate(req, res, {
    action: "explanations",
    limit: 10,
    prompt: conceptExplainPrompt(question.trim()),
    schema: explanationSchema,
    validate: (data) => nonEmpty(data?.title) && nonEmpty(data?.explanation),
    maxOutputTokens: 4096,
  });
}

module.exports = { generateInterviewQuestions, generateConceptExplanation };
