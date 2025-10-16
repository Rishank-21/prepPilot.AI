const  Question = require('../models/Question')
const User = require("../models/User")
const Session = require("../models/Session")


exports.addQuestionsToSession = async (req , res) => {
    try {
        const { sessionId , questions} = req.body
        if(!sessionId || !questions || !Array.isArray(questions)){
            return res.status(400).json({ message : "Invalid input data"})
        }
        const session = await Session.findById(sessionId)
        if(!session) {
            return res.status(404).json({ message : "session not found"})
        }
        const createQuestions = await Question.insertMany(
            questions.map((q) => ({
                session : sessionId,
                question : q.question,
                answer : q.answer,
            }))
        );

        session.questions.push(...createQuestions.map((q) => q._id));
        await session.save();
        res.status(201).json(createQuestions)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message : "server error"})
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