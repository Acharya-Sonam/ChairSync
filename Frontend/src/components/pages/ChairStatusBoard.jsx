import { useState, useEffect, useCallback } from "react";
import "./ChairStatusBoard.css";
import { chairService } from "../../services/api";
import { FaChair } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";

// Formats seconds as "H:MM:SS" or "M:SS"
function formatElapsed(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function SeatCard({ chair, now, onToggle }) {
    const elapsed = chair.isOccupied && chair.occupiedSince
        ? Math.max(0, Math.floor((now - new Date(chair.occupiedSince).getTime()) / 1000))
        : 0;

    return (
        <div
            className={`seat ${chair.isOccupied ? "occupied" : "available"}`}
            onClick={() => onToggle(chair)}
        >
            <FaChair className="chair-icon" />
            <h3>{chair.chairNumber}</h3>
            <p>
                {chair.isOccupied ? (
                    <>
                        <MdCancel /> Occupied
                    </>
                ) : (
                    <>
                        <MdCheckCircle /> Available
                    </>
                )}
            </p>
            {chair.isOccupied && (
                <div className="seat-timer">{formatElapsed(elapsed)}</div>
            )}
        </div>
    );
}

function ChairStatusBoard() {
    const [chairs, setChairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [now, setNow] = useState(Date.now());

    const loadChairs = useCallback(async () => {
        try {
            const res = await chairService.getChairs();
            setChairs(res.data);
            setError("");
        } catch (err) {
            setError("Couldn't load chairs. Check your connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadChairs();
    }, [loadChairs]);

    // Single shared ticking clock drives every occupied chair's timer
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const handleToggle = async (chair) => {
        const nowOccupied = !chair.isOccupied;
        const updated = {
            ...chair,
            isOccupied: nowOccupied,
            occupiedSince: nowOccupied ? new Date().toISOString() : null,
        };

        // Reflect the change immediately — staff shouldn't wait on a network round trip
        setChairs((prev) => prev.map((c) => (c.id === chair.id ? updated : c)));

        try {
            await chairService.updateChair(chair.id, updated);
        } catch (err) {
            setChairs((prev) => prev.map((c) => (c.id === chair.id ? chair : c)));
            setError("Couldn't save that change. Try again.");
        }
    };

    if (loading) {
        return (
            <div className="container">
                <h1>💈 Barber Shop Chair Status</h1>
                <p style={{ color: "white" }}>Loading chairs…</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>💈 Barber Shop Chair Status</h1>

            <div className="mirror">
                <h2>🪞 MIRROR</h2>
            </div>

            {error && (
                <p style={{ color: "#ffb3b3", fontWeight: 600, marginBottom: 16 }}>{error}</p>
            )}

            <div className="legend">
                <div className="legend-item">
                    <span className="box available"></span>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <span className="box occupied"></span>
                    <span>Occupied</span>
                </div>
            </div>

            <div className="seat-grid">
                {chairs.map((chair) => (
                    <SeatCard key={chair.id} chair={chair} now={now} onToggle={handleToggle} />
                ))}
            </div>
        </div>
    );
}

export default ChairStatusBoard;
