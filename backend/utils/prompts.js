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
  return `You are an expert technical interviewer. Explain this question clearly.

QUESTION: "${question}"

Create a JSON response with EXACTLY this structure (no extra text before or after):
{
  "title": "One sentence title (max 50 chars)",
  "explanation": "Your explanation here with code examples"
}

RULES FOR EXPLANATION:
1. Start with a simple definition
2. Explain why it matters
3. If code is needed, use this format EXACTLY:
   \`\`\`javascript
   // code here
   \`\`\`
4. Use markdown: **bold**, *italic*, - lists
5. Keep it beginner-friendly but comprehensive
6. No text before or after the JSON object
7. All quotes in the explanation must use single quotes or be escaped
8. Maximum 1500 characters for explanation

RETURN ONLY THE JSON OBJECT, NOTHING ELSE.`;
};

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
