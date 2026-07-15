import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="card glass-panel auth-card" onSubmit={handleSubmit}>
                <h2 className="section-title">ChairSync Login</h2>

                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="owner@leaddingedge.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            </form>
        </div>
    );
}

export default Login;
