import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Resume from "../models/Resume.js";
import fetch from "node-fetch";
import pdfParse from "pdf-parse";

dotenv.config();
const router = express.Router();

// Ensure 'uploads' directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Load API key
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Resume Analysis Route
router.post("/analyze", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded." });

        const filePath = req.file.path;
        console.log("File uploaded:", filePath);

        // Read and parse PDF
        const pdfBuffer = fs.readFileSync(filePath);
        const parsedPdf = await pdfParse(pdfBuffer);
        const resumeText = parsedPdf.text.trim();

        console.log("Extracted Resume Text:", resumeText);

        // Call Groq API for analysis
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You analyze resumes and provide structured feedback." },
                    { role: "user", content: `Analyze this resume and provide:
                        1. Resume Analysis Score (Content, Sections, Skills, Style) as percentages.
                        2. Issues categorized under Content, Format, Sections, Skills, and Style.
                        3. Suggested fixes for each issue.
                        Resume Text: ${resumeText}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            return res.status(response.status).json({ error: "Groq API error", details: errorData });
        }

        const data = await response.json();
        const extractedText = data.choices?.[0]?.message?.content;
        if (!extractedText) return res.status(500).json({ error: "Invalid Groq API response format" });

        // Save to MongoDB
        const newResume = new Resume({ text: extractedText, filePath });
        await newResume.save();

        // Delete uploaded file after processing
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            data: {
                resumeId: newResume._id,
                suggestions: extractedText
            }
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Mock Interview Route
// Mock Interview Route (resumeroute.js)
router.post("/mockinterview", async (req, res) => {
    try {
        const { resumeText, jobRole, difficulty } = req.body;
        if (!resumeText) return res.status(400).json({ error: "No resume text provided." });

        console.log("Generating mock interview questions for:", resumeText);

        // Call Groq API for interview questions
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY?.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You generate mock interview questions based on job role and difficulty level." },
                    { role: "user", content: `Generate ${difficulty === "beginner" ? 5 : 10} interview questions for a ${jobRole} based on this resume Extract and return only the question without any additional words or descriptions. 
                        ${resumeText}` }
                ]
            })
        });

        const responseBody = await response.text();
        console.log("Groq API Raw Response:", responseBody);

        if (!response.ok) {
            console.error("API Error Response:", responseBody);
            return res.status(response.status).json({ error: "Groq API error", details: responseBody });
        }

        const data = JSON.parse(responseBody);
        let questions = data.choices?.[0]?.message?.content.split("\n").filter(q => q.trim() !== "");

        // Remove headings like "Technical Interview Questions:" & "Behavioral Interview Questions:"
        questions = questions.filter(q => !q.toLowerCase().includes("technical interview") && !q.toLowerCase().includes("behavioral interview"));

        if (!questions.length) {
            console.error("Invalid Groq API response format:", data);
            return res.status(500).json({ error: "Invalid response format", details: data });
        }

        res.json({ success: true, questions });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.post("/job-suggestions", async (req, res) => {
    try {
        const { resumeText } = req.body;
        if (!resumeText) return res.status(400).json({ error: "No resume text provided." });

        console.log("Generating job role suggestions for:", resumeText);

        // Call Groq API for job role suggestions
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You analyze resumes and suggest the best job roles." },
                    { role: "user", content: `Extract and return only the job role title from the given text without any additional words or descriptions.  :
                        ${resumeText}` }
                ]
            })
        });

        const data = await response.json();
        const jobRoles = data.choices?.[0]?.message?.content.split("\n").map(role => role.trim()).filter(role => role !== "");

        if (!jobRoles) {
            return res.status(500).json({ error: "Invalid Groq API response format" });
        }

        res.json({ success: true, suggestions: jobRoles });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;
