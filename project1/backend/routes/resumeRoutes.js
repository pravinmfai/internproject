import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// DeepSeek API Config
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Route: Upload and Analyze Resume
router.post("/analyze", upload.single("resume"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const resumeData = fs.readFileSync(filePath, "utf-8");

        // Call DeepSeek API
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat:free',
                messages: [{ role: "user", content: `Analyze this resume:\n${resumeData}` }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({ error: "Failed to analyze resume" });
        }

        const { name, email, phone, skills, experience, education, suggestions } = data;

        // Save to MongoDB
        const newResume = new Resume({
            name, email, phone, skills, experience, education, suggestions, filePath
        });

        await newResume.save();

        // Delete uploaded file
        fs.unlinkSync(filePath);

        res.json({ success: true, resumeId: newResume._id });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route: Get Resume by ID
router.get("/:id", async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ error: "Resume not found" });

        res.json({ success: true, data: resume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
