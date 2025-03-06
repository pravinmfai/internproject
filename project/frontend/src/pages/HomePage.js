import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
            const allowedExtensions = ["pdf", "doc", "docx"];

            if (allowedExtensions.includes(fileExtension)) {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
                setFile(null);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert("Please upload a resume file.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/resume/analyze", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            
            if (response.ok && result.success && result.data) {
                navigate("/result", { state: { data: result.data } });
            } else {
                throw new Error(result.message || "Failed to analyze resume.");
            }
        } catch (error) {
            setError(error.message || "Error analyzing resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Resume Analysis</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={loading}
                    required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading || !file}>
                    {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
            </form>
        </div>
    );
};

export default HomePage;
