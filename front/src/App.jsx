import React, { useEffect, useRef, useState } from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import UserManager from "./components/UserManager";
import Login from "./components/Login";
import "./App.css";
import Home from "./pages/Home";
import CardManager from "./components/CardManager";
import RandomCard from "./pages/RandomCard";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        Navigate("/login");
    };

    const isAdmin = userRole === "admin";

    return (
        <Router>
            <CssBaseline />
            {isAuthenticated && (
                <nav className="nav-container">
                    <h1 className="nav-title">Scamrim</h1>
                    <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        &#9776;
                    </button>
                    <div className={`links-container ${isMenuOpen ? "open" : ""}`}>
                        <Link style={{ color: "white", textDecoration: "none" }} to="/admin" onClick={handleLinkClick}>
                            Home
                        </Link>
                        {/* <Link style={{ color: "white", textDecoration: "none" }} to="/users">Users</Link> */}
                        <Link style={{ color: "white", textDecoration: "none" }} to="/admin/cards" onClick={handleLinkClick}>
                            Cards
                        </Link>
                        <Link style={{ color: "white", textDecoration: "none" }} to="/" onClick={handleLinkClick}>
                            Randomizer
                        </Link>
                        <Link className="logout-link" onClick={handleLogout}>
                            Logout
                        </Link>
                    </div>
                </nav>
            )}
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/admin" />} />
                <Route path="/admin" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/admin/cards" element={isAuthenticated ? <CardManager /> : <Navigate to="/login" />} />
                <Route path="/" element={<RandomCard />} />
            </Routes>
        </Router>
    );
};

export default App;
