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
  return `
You are an AI assistant that explains technical interview concepts.

Your task:
1. Explain this interview question: "${question}"
2. Provide a clear, beginner-friendly explanation
3. Include code examples if relevant
4. Create a short descriptive title

CRITICAL: You MUST return ONLY a valid JSON object in this EXACT format:
{
  "title": "Short descriptive title here",
  "explanation": "Your detailed explanation here with markdown formatting if needed"
}

Rules:
- Do NOT include any text before or after the JSON
- Do NOT use markdown code blocks like \`\`\`json
- Do NOT add comments
- The explanation can include markdown formatting (headings, code blocks, lists, etc.)
- Keep the title under 60 characters
- Make sure all quotes are properly escaped

Return ONLY the JSON object, nothing else.
  `;
};

// ...existing code...

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
