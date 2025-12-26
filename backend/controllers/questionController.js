const  Question = require('../models/Question')
const User = require("../models/User")
const Session = require("../models/Session")


exports.addQuestionsToSession = async (req , res) => {
    try {
        const { sessionId , questions} = req.body
        
        console.log("📝 Adding questions to session...");
        console.log("Questions received:", questions);

        if (!sessionId) {
          return res.status(400).json({ message: "Session ID is required" });
        }

        if (!questions) {
          return res.status(400).json({ message: "Questions are required" });
        }

        // Handle nested data structure from AI response
        let questionsArray;

        if (Array.isArray(questions)) {
          questionsArray = questions;
        } else if (questions.data && Array.isArray(questions.data)) {
          questionsArray = questions.data;
        } else if (typeof questions === "object" && questions.questions) {
          questionsArray = questions.questions;
        } else {
          console.error("❌ Invalid questions format:", typeof questions);
          return res.status(400).json({
            message: "Invalid questions format. Expected an array.",
            received: typeof questions,
          });
        }

        console.log("✅ Questions array length:", questionsArray.length);

        const session = await Session.findById(sessionId);
        if (!session) {
          return res.status(404).json({ message: "session not found" });
        }

        const createQuestions = await Question.insertMany(
          questionsArray.map((q) => ({
            session: sessionId,
            question: q.question,
            answer: q.answer,
          }))
        );

        session.questions.push(...createQuestions.map((q) => q._id));
        await session.save();
        
        console.log("✅ Questions added successfully");
        
        res.status(201).json({
            success: true,
            message: "Questions added successfully",
            questions: createQuestions
        })
    } catch (error) {
        console.error("❌ Error adding questions:", error)
        return res.status(500).json({ message : "server error", error: error.message})
    }
}

exports.togglePinQuestion  = async ( req , res) => {
    try {
        const question = await Question.findById(req.params.id)
        if(!question){
            return res.status(404).json({ message : "question not found"})
        }
        question.isPinned = !question.isPinned
        await question.save()

        res.status(200).json({ success : true , question})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message : "server error"})
    }
}

exports.updateQuestionNote = async ( req , res) => {
    try {
        const { note } = req.body
        const question = await Question.findById(req.params.id)
        if(!question) {
            return res.status(404).json({ message : "question not found"})
        }
        question.note = note || "";
        await question.save()
        return res.status(200).json({ success : true , question})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message : "server error"})
    }
}