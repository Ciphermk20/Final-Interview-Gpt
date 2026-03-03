const Report = require('../models/Report');
const { evaluateAnswer } = require('../services/geminiService');

const evaluateResponse = async (req, res) => {
  const { question, transcript, role, experience, type, language, videoFilename, userId } = req.body;

  try {
    // 1. Get AI Evaluation
    const evaluation = await evaluateAnswer(question, transcript, role, experience, type, language);

    // 2. Save to MongoDB
    const newReport = new Report({
      user: userId, // Pass this from frontend (Auth context)
      role,
      language,
      type,
      experience,
      question,
      transcript,
      videoUrl: videoFilename,
      score: evaluation.score,
      feedback: evaluation.summary,
      tips: evaluation.improvementTips
    });

    await newReport.save();

    // 3. Return both the evaluation and the report ID
    res.status(200).json({
      ...evaluation,
      reportId: newReport._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Evaluation failed." });
  }
};

module.exports = { evaluateResponse };