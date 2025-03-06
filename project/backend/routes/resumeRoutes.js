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
        const extractedText = data.choices?.[0]?.message?.content || "";
if (!extractedText) {
    return res.status(500).json({ error: "Invalid Groq API response format", details: data });
}

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
router.post("/mockinterview", async (req, res) => {
    try {
        const { resumeText, jobRole, difficulty } = req.body;
        if (!resumeText) return res.status(400).json({ error: "No resume text provided." });

        console.log("Generating mock interview questions for:", resumeText);

        // Call Groq API for interview questions and answers
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY?.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You generate mock interview questions and their correct answers based on job role and difficulty level." },
                    { role: "user", content: `Generate 15 interview questions for a ${jobRole} based on this resume. For each question, provide the correct answer. Format the response as:
                        Q1: [Question 1]
                        A1: [Correct Answer 1]
                        Q2: [Question 2]
                        A2: [Correct Answer 2]
                        ...
                        Q15: [Question 15]
                        A15: [Correct Answer 15]
                        Resume Text: ${resumeText}` }
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
        const content = data.choices?.[0]?.message?.content;

        // Parse questions and answers from the response
        const qaPairs = content.split("\n").filter(line => line.trim() !== "");
        const questions = [];
        const expectedAnswers = [];

        for (let i = 0; i < qaPairs.length; i += 2) {
            const question = qaPairs[i].replace(/^Q\d+: /, "").trim();
            const answer = qaPairs[i + 1].replace(/^A\d+: /, "").trim();
            questions.push(question);
            expectedAnswers.push(answer);
        }

        if (!questions.length || !expectedAnswers.length) {
            console.error("Invalid Groq API response format:", data);
            return res.status(500).json({ error: "Invalid response format", details: data });
        }

        res.json({ success: true, questions, expectedAnswers });

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

router.post("/evaluate-answers", async (req, res) => {
    try {
        const { questions, answers, expectedAnswers } = req.body;
        if (!questions || !answers || !expectedAnswers) return res.status(400).json({ error: "Missing required data." });

        console.log("Evaluating answers...");

        // Call Groq API for answer evaluation
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You evaluate interview answers. Clearly label answers as 'Correct' or 'Wrong' and explain why." },
                    { role: "user", content: `Evaluate these answers. Clearly mention 'Correct' or 'Wrong' for each:
                        ${questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}\nExpected: ${expectedAnswers[i]}`).join("\n\n")}
                    ` }
                ]
            })
        });

        const data = await response.json();
        const evaluations = data.choices?.[0]?.message?.content.split("\n\n").map(line => line.trim()).filter(line => line !== "");

        if (!evaluations.length) {
            return res.status(500).json({ error: "Invalid response format" });
        }

        let correctCount = evaluations.filter((evalText) => evalText.includes("Correct")).length;
        let wrongCount = evaluations.length - correctCount;

        res.json({
            success: true,
            evaluation: evaluations,
            correctCount,
            wrongCount
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;
