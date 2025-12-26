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
  return `Explain this question: "${question}"

Output format (MUST be valid JSON):
{
  "title": "Simple title",
  "explanation": "Your explanation here. Use markdown for formatting."
}

Rules:
1. Keep title short (under 50 chars)
2. Explanation should be 500-1000 chars
3. Use markdown: **bold**, *italic*, code blocks
4. Only output the JSON, nothing else
5. No markdown code fences (no \`\`\`json)
6. Properly escape all quotes`;
};

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
