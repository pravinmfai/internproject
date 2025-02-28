import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Groq API Config
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL; // Ensure this loads the updated URL


router.post("/analyze", upload.single("resume"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const resumeData = fs.readFileSync(filePath, "utf-8");

        // Log for debugging
        console.log("Using API Key:", GROQ_API_KEY ? "Key Loaded" : "Missing Key");

        // Call Groq API
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You are an AI that analyzes resumes." },
                    { role: "user", content: `Analyze this resume and extract details:\n${resumeData}` }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Log the API response for debugging

        // Extract relevant fields
        const content = data.choices[0].message.content;
        const extractedData = JSON.parse(content); // Ensure response is valid JSON

        const { name, email, phone, skills, experience, education, suggestions } = extractedData;

        // Save to MongoDB
        const newResume = new Resume({
            name, email, phone, skills, experience, education, suggestions, filePath
        });

        await newResume.save();

        // Delete uploaded file after successful save
        fs.unlinkSync(filePath);

        res.json({ success: true, resumeId: newResume._id });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;
