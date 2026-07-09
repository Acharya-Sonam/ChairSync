import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./components/pages/Dashboard";
import Queue from "./components/pages/Queue";
import Customers from "./components/pages/Customers";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Sidebar />

                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/queue" element={<Queue />} />
                        <Route path="/customers" element={<Customers />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;