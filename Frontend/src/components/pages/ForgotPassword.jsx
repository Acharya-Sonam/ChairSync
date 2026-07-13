import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
        } finally {
            // Always show the same message, whether or not the email exists —
            // prevents leaking which emails are registered.
            setSent(true);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="card glass-panel auth-card" onSubmit={handleSubmit}>
                <h2 className="section-title">Reset Password</h2>

                {sent ? (
                    <p className="muted">
                        If that email exists, a reset link has been sent. Check your inbox.
                    </p>
                ) : (
                    <>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="admin@leadingedge.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </>
                )}

                <Link to="/login" className="auth-link">Back to login</Link>
            </form>
        </div>
    );
}

export default ForgotPassword;