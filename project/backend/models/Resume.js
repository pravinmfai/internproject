import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: String,
    education: String,
    suggestions: String,
    filePath: String, // Store file path for reference
    createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;
