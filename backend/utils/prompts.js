const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => {
  return `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If the answer needs a code example, add a small code block inside.
- Keep formatting very clean.
- Return a pure JSON array like: 
[
  {
    "question" : "Question here?",
    "answer" : "Answer here."
  }
]

Important: Do NOT add any extra text. Only return valid JSON.
  `;
};

const conceptExplainPrompt = (question) => {
  return `Explain this technical interview question clearly and concisely.

QUESTION: "${question}"

Return ONLY a JSON object with this structure:
{
  "title": "Brief title (max 50 characters)",
  "explanation": "Clear explanation with code examples if needed"
}

RULES:
- Start with a simple definition
- Explain why it matters in interviews
- If code helps, use markdown code blocks: \`\`\`javascript\ncode\n\`\`\`
- Use markdown formatting: **bold**, *italic*, lists
- Keep it under 1200 characters
- NO text before or after the JSON
- Escape all double quotes inside strings

Return ONLY valid JSON, nothing else.`;
};

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
