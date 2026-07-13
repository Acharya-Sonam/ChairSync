import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./components/pages/Dashboard";
import Queue from "./components/pages/Queue";
import Customers from "./components/pages/Customers";
import ChairStatusBoard from "./components/pages/ChairStatusBoard";
import Login from "./components/pages/Login";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";

function RequireAuth({ children }) {
    const token = localStorage.getItem("chairsync_token");
    return token ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route
                    path="/*"
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