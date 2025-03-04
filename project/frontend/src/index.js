import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import for React 18
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import MockInterviewPage from "./pages/MockInterviewPage";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/mock-interview" element={<MockInterviewPage />} />
            </Routes>
        </Router>
    );
};

// ✅ Correct way to render in React 18
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found");
}
