import TutorSession from "../models/tutorSession.js";
import Onboarding from "../models/onboarding.js";
import { generateChatStream } from "../config/gemini.js";

function buildSystemPrompt({ goal, weakSkills, mode }) {
    const modeInstructions = {
        hint: `You are a tutor that gives HINTS only. Never give the full answer directly. Guide the student step-by-step with questions and small nudges. Use 💡 emoji.`,
        explain: `You are a tutor that gives DETAILED EXPLANATIONS. Break down concepts clearly with examples, analogies, and structure. Use 📘 emoji.`,
        practice: `You are a tutor that gives PRACTICE QUESTIONS. After acknowledging the student's query, provide a relevant practice problem. Use 🎯 emoji.`,
    };

    return `You are SkillSynapse AI Tutor — an expert, friendly, adaptive learning assistant.

Student Goal: ${goal || "General Learning"}
Known Weak Skills: ${weakSkills?.length ? weakSkills.join(", ") : "Not assessed yet"}

${modeInstructions[mode] || modeInstructions.hint}

Rules:
- Keep responses concise but helpful.
- Use markdown formatting for code, lists, and emphasis.
- Always encourage the learner.
- If the student seems stuck, offer to simplify.`;
}

async function getUserContext(userId) {
    const onboarding = await Onboarding.findOne({ user: userId }).lean();
    return {
        goal: onboarding?.goal || "Personalized Learning",
        weakSkills: onboarding?.resultAnalysis?.json?.weaknesses || [],
    };
}

function generateTitle(message) {
    const cleaned = message.replace(/\n/g, " ").trim();
    return cleaned.length > 50 ? cleaned.slice(0, 47) + "..." : cleaned;
}

export const chat = async (req, res) => {
    try {
        const { message, mode = "hint", sessionId } = req.body;
        const userId = req.user._id;

        if (!message || !message.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Message is required" });
        }

        // Load or create session
        let session;
        if (sessionId) {
            session = await TutorSession.findOne({ _id: sessionId, user: userId });
            if (!session) {
                return res
                    .status(404)
                    .json({ success: false, message: "Session not found" });
            }
        } else {
            session = await TutorSession.create({
                user: userId,
                title: generateTitle(message),
                messages: [],
            });
        }

        // Append user message
        session.messages.push({ role: "user", content: message });

        const userContext = await getUserContext(userId);
        const systemPrompt = buildSystemPrompt({ ...userContext, mode });
        const chatMessages = session.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Session-Id", session._id.toString());
        res.flushHeaders();

        // Stream response
        let fullReply = "";

        try {
            for await (const chunk of generateChatStream(
                systemPrompt,
                chatMessages,
            )) {
                fullReply += chunk;
                res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
            }
        } catch (streamErr) {
            console.error("Gemini stream error:", streamErr);
            res.write(
                `data: ${JSON.stringify({ error: "AI generation failed. Please try again." })}\n\n`,
            );
        }

        // Save assistant reply
        if (fullReply) {
            session.messages.push({ role: "assistant", content: fullReply });
        }
        await session.save();

        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error) {
        console.error("Tutor chat error:", error);

        // If headers already sent, close the stream
        if (res.headersSent) {
            res.write(
                `data: ${JSON.stringify({ error: "Internal server error" })}\n\n`,
            );
            res.write(`data: [DONE]\n\n`);
            res.end();
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to process chat",
                error: error.message,
            });
        }
    }
};

export const getHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TutorSession.findOne({
            _id: sessionId,
            user: req.user._id,
        }).lean();

        if (!session) {
            return res
                .status(404)
                .json({ success: false, message: "Session not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                sessionId: session._id,
                title: session.title,
                messages: session.messages,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch history",
            error: error.message,
        });
    }
};

export const getSessions = async (req, res) => {
    try {
        const sessions = await TutorSession.find({ user: req.user._id })
            .select("_id title createdAt updatedAt")
            .sort({ updatedAt: -1 })
            .lean();

        res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions",
            error: error.message,
        });
    }
};

export const deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await TutorSession.findOneAndDelete({
            _id: sessionId,
            user: req.user._id,
        });

        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Session not found" });
        }

        res
            .status(200)
            .json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete session",
            error: error.message,
        });
    }
};

export const renameSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Title is required" });
        }

        const session = await TutorSession.findOneAndUpdate(
            { _id: sessionId, user: req.user._id },
            { title: title.trim() },
            { new: true },
        );

        if (!session) {
            return res
                .status(404)
                .json({ success: false, message: "Session not found" });
        }

        res.status(200).json({
            success: true,
            message: "Session renamed successfully",
            data: { title: session.title },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to rename session",
            error: error.message,
        });
    }
};

