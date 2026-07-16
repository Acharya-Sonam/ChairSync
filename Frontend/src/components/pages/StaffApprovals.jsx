import { useState, useEffect, useCallback } from "react";
import { authService } from "../../services/api";

function StaffApprovals() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    const load = useCallback(async () => {
        try {
            const res = await authService.getPendingStaff();
            setPending(res.data);
            setError("");
        } catch (err) {
            setError("Couldn't load pending staff requests.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleApprove = async (id) => {
        setBusyId(id);
        try {
            await authService.approveStaff(id);
            setPending((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            setError("Couldn't approve that account. Try again.");
        } finally {
            setBusyId(null);
        }
    };

    const handleReject = async (id) => {
        setBusyId(id);
        try {
            await authService.rejectStaff(id);
            setPending((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            setError("Couldn't reject that account. Try again.");
        } finally {
            setBusyId(null);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Staff Approvals</h1>
                    <p className="page-subtitle">Review and approve new staff registration requests</p>
                </div>
            </div>

            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

            <div className="card glass-panel">
                {pending.length === 0 ? (
                    <div className="table-empty">No pending requests. New staff sign-ups will show up here.</div>
                ) : (
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pending.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td className="muted">{u.email}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ marginRight: 8, padding: "6px 14px" }}
                                            disabled={busyId === u.id}
                                            onClick={() => handleApprove(u.id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn-complete"
                                            style={{ padding: "6px 14px" }}
                                            disabled={busyId === u.id}
                                            onClick={() => handleReject(u.id)}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default StaffApprovals;
