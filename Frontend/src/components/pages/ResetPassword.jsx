import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../services/api";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setDone(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "This reset link is invalid or has expired.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-page">
                <div className="card glass-panel auth-card">
                    <p className="auth-error">Missing or invalid reset link.</p>
                    <Link to="/forgot-password" className="auth-link">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <form className="card glass-panel auth-card" onSubmit={handleSubmit}>
                <h2 className="section-title">Set New Password</h2>

                {error && <div className="auth-error">{error}</div>}

                {done ? (
                    <p className="muted">Password updated. Redirecting to login...</p>
                ) : (
                    <>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save New Password"}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}

export default ResetPassword;