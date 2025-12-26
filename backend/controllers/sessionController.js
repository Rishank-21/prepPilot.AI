const Session = require('../models/Session');
const Question = require('../models/Question');

exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    console.log("📝 Creating session...");
    console.log("Questions received:", questions);

    // 🔍 Validate questions
    if (!questions) {
      return res.status(400).json({
        success: false,
        message: "Questions are required"
      });
    }

    // 🆕 Handle both array and object with data property
    let questionsArray;
    
    if (Array.isArray(questions)) {
      // Direct array
      questionsArray = questions;
    } else if (questions.data && Array.isArray(questions.data)) {
      // Object with data property
      questionsArray = questions.data;
    } else if (typeof questions === 'object' && questions.questions) {
      // Object with questions property
      questionsArray = questions.questions;
    } else {
      console.error("❌ Invalid questions format:", typeof questions);
      return res.status(400).json({
        success: false,
        message: "Invalid questions format. Expected an array.",
        received: typeof questions
      });
    }

    console.log("✅ Questions array length:", questionsArray.length);

    // Create session
    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description
    });

    console.log("✅ Session created:", session._id);

    // Create questions
    const questionDocs = await Promise.all(
      questionsArray.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer
        });
        return question._id;
      })
    );

    console.log("✅ Questions created:", questionDocs.length);

    // Update session with questions
    session.questions = questionDocs;
    await session.save();

    console.log("✅ Session updated with questions");

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error("❌ Error creating session:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();
      
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }
    
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this session"
      });
    }

    // Delete all questions associated with session
    await Question.deleteMany({ session: session._id });

    // Delete session
    await Session.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      message: "Session deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};