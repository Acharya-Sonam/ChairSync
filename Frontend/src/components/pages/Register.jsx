import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.register(name, email, password);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="auth-page">
                <div className="card glass-panel auth-card">
                    <h2 className="section-title">Request submitted</h2>
                    <p className="page-subtitle" style={{ marginBottom: 16 }}>
                        Your account has been sent to the shop owner for approval.
                        You'll be able to log in once it's approved.
                    </p>
                    <Link to="/login" className="btn btn-primary" style={{ display: "block", textAlign: "center" }}>
                        Back to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <form className="card glass-panel auth-card" onSubmit={handleSubmit}>
                <h2 className="section-title">Staff Registration</h2>
                <p className="page-subtitle" style={{ marginBottom: 16 }}>
                    Creates a Staff account. Only the shop owner has Admin access.
                </p>

                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Ramesh Thapa"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
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
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                <Link to="/login" className="auth-link">Already have an account? Sign in</Link>
            </form>
        </div>
    );
}

export default Register;
