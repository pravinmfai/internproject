import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MockInterviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resumeText = location.state?.resumeText;
    const jobRole = location.state?.jobRole;
    const difficulty = location.state?.difficulty;
    
    const [questions, setQuestions] = useState([]);
    const [expectedAnswers, setExpectedAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [skippedCount, setSkippedCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [evaluationResults, setEvaluationResults] = useState([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!resumeText || !jobRole || !difficulty) return;

            try {
                const response = await fetch("http://localhost:5000/api/resume/mockinterview", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeText, jobRole, difficulty }),
                });

                if (!response.ok) throw new Error("Failed to fetch interview questions.");

                const data = await response.json();
                setQuestions(data.questions || []);
                setExpectedAnswers(data.expectedAnswers || []);
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
            evaluateAnswers();
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

    const evaluateAnswers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/resume/evaluate-answers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions, answers, expectedAnswers }),
            });

            if (!response.ok) throw new Error("Failed to evaluate answers.");

            const data = await response.json();
            setEvaluationResults(data.evaluation);
            setCorrectCount(data.correctCount);
            setWrongCount(data.wrongCount);
            setShowResults(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Mock Interview</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : showResults ? (
                <div>
                    <h2>Mock Interview Completed</h2>
                    <p><strong>Correct Answers:</strong> {correctCount}</p>
                    <p><strong>Wrong Answers:</strong> {wrongCount}</p>
                    <p><strong>Skipped Questions:</strong> {skippedCount}</p>
                    {evaluationResults.map((result, index) => (
                        <div key={index} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
                            <h3>Q{index + 1}: {questions[index]}</h3>
                            <p><strong>Your Answer:</strong> {answers[index] || "Not answered"}</p>
                            <p><strong>Suggested Answer:</strong> {expectedAnswers[index]}</p>
                            <p style={{ color: result.includes("Correct") ? "green" : "red" }}>
                                <strong>{result.includes("Correct") ? "✅ Correct" : "❌ Wrong"}</strong>
                            </p>
                        </div>
                    ))}
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

