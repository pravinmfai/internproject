import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MockInterviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resumeText = location.state?.resumeText;
    const jobRole = location.state?.jobRole;
    const difficulty = location.state?.difficulty;
    
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [skippedCount, setSkippedCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/resume/mockinterview", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeText, jobRole, difficulty }),
                });
        
                if (!response.ok) throw new Error("Failed to fetch interview questions.");
        
                const data = await response.json();
                console.log("API Response:", data);
        
                setQuestions(Array.isArray(data.questions) ? data.questions : []);
                setAnswers(new Array(data.questions.length).fill(""));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchQuestions();
    }, [resumeText, jobRole, difficulty]);

    const handleAnswerChange = (e) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = e.target.value;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSkip = () => {
        setSkippedCount(skippedCount + 1);
        handleNext();
    };

    return (
        <div>
            <h1>Mock Interview</h1>
            {loading ? (
                <p>Loading questions...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : showResults ? (
                <div>
                    <h2>Mock Interview Completed</h2>
                    <p><strong>Score:</strong> {Math.floor((answers.filter(ans => ans.trim() !== "").length / questions.length) * 10)}/10</p>
                    <p><strong>Skipped Questions:</strong> {skippedCount}</p>
                    <button onClick={() => navigate("/")}>Go Home</button>
                </div>
            ) : (
                <div>
                    <h3>Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</h3>
                    <textarea
                        value={answers[currentQuestionIndex]}
                        onChange={handleAnswerChange}
                        placeholder="Your answer here..."
                        rows="4"
                        cols="50"
                    />
                    <div>
                        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
                        <button onClick={handleSkip}>Skip</button>
                        <button onClick={handleNext}>{currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockInterviewPage;
