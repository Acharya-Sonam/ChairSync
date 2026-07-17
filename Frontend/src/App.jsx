import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "./services/api";

import Sidebar from "./components/layout/Sidebar";

import Landing from "./components/pages/Landing";
import Dashboard from "./components/pages/Dashboard";
import Queue from "./components/pages/Queue";
import Customers from "./components/pages/Customers";
import ChairStatusBoard from "./components/pages/ChairStatusBoard";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import StaffApprovals from "./components/pages/StaffApprovals";

function RequireAuth({ children, role }) {
    const [status, setStatus] = useState("checking"); // "checking" | "authed" | "guest" | "forbidden"

    useEffect(() => {
        authService.me()
            .then((res) => {
                if (role && res.data.role !== role) {
                    setStatus("forbidden");
                } else {
                    setStatus("authed");
                }
            })
            .catch(() => setStatus("guest"));
    }, [role]);

    if (status === "checking") {
        return (
            <div className="page-loading">
                <div className="spinner" />
            </div>
        );
    }

    if (status === "guest") return <Navigate to="/login" replace />;
    if (status === "forbidden") return <Navigate to="/app" replace />;
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route
                    path="/app/*"
                    element={
                        <RequireAuth>
                            <div className="app-container">
                                <Sidebar />
                                <div className="main-content">
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/queue" element={<Queue />} />
                                        <Route path="/customers" element={<Customers />} />
                                        <Route path="/status" element={<ChairStatusBoard />} />
                                        <Route
                                            path="/staff-approvals"
                                            element={
                                                <RequireAuth role="Admin">
                                                    <StaffApprovals />
                                                </RequireAuth>
                                            }
                                        />
                                    </Routes>
                                </div>
                            </div>
                        </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
