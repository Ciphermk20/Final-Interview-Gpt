const { GoogleGenAI } = require('@google/genai');

const evaluateAnswer = async (question, userAnswer, role, experience, type, language) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in your .env file!");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // This dynamic prompt forces the AI to change its grading criteria based on user selection
  const prompt = `
    You are an expert Senior HR and Technical Interviewer. 
    You are evaluating a candidate with the following profile:
    - Target Role: ${role}
    - Experience Level: ${experience}
    - Interview Type: ${type}
    - Primary Tech Stack: ${language}

    The Question Asked: "${question}"
    The Candidate's Response: "${userAnswer}"

    EVALUATION GUIDELINES:
    1. If Experience is "Fresher", focus on basic syntax and conceptual understanding.
    2. If Experience is "Senior", focus on system design, scalability, and best practices.
    3. If Type is "Technical", grade strictly on accuracy of the ${language} concepts.
    4. If Type is "HR", grade based on communication, tone, and confidence.
    5. If Type is "Coding", evaluate the logic and efficiency of the verbalized solution.

    Return ONLY a valid JSON object with this exact structure:
    {
      "score": <number 1-100>,
      "confidence": <number 1-100>,
      "clarity": <number 1-100>,
      "improvementTips": ["tip 1", "tip 2", "tip 3"],
      "summary": "<a 2-3 sentence professional summary of the performance>"
    }
  `;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5-flash for speed and reliability

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini AI Evaluation Error:", error);
    throw new Error("Failed to evaluate response with AI");
  }
};

module.exports = { evaluateAnswer };