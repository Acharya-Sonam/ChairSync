import { useState, useEffect } from 'react';
import { customerService, chairService } from '../../services/api';

function StatCard({ label, value, icon, color, glow }) {
    return (
        <div className="stat-card" style={{ '--glow-color': glow }}>
            <div className="stat-icon" style={{ background: `rgba(${color}, 0.15)`, color: `rgb(${color})` }}>
                {icon}
            </div>
            <div>
                <p className="stat-label">{label}</p>
                <h2 className="stat-value">{value}</h2>
            </div>
        </div>
    );
}

function Timer({ startTime }) {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        if (!startTime) return;
        const updateTimer = () => {
            const start = new Date(startTime).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            if (diff < 0) {
                setElapsed('00:00');
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return <span className="chair-timer" style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{elapsed}</span>;
}

function Dashboard() {
    const [chairs, setChairs] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 15000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            const [chairRes, custRes] = await Promise.all([
                chairService.getChairs(),
                customerService.getCustomers()
            ]);
            setChairs(chairRes.data);
            setCustomers(custRes.data);
        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (customerId) => {
        try {
            await customerService.completeHaircut(customerId);
            await loadDashboardData();
        } catch (error) {
            console.error("Error completing haircut", error);
        }
    };

    const occupiedCount = chairs.filter(c => c.isOccupied).length;
    const availableCount = chairs.filter(c => !c.isOccupied).length;
    const waitingCount = customers.filter(c => c.status === 'Waiting').length;
    const completedCount = customers.filter(c => c.status === 'Completed').length;

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Real-time chair and queue monitoring</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={loadDashboardData}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
                <StatCard label="Total Chairs" value={chairs.length} color="79, 172, 254" glow="rgba(79,172,254,0.3)"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M4 9h16v5H4z"/><path d="M8 9v5"/><path d="M16 9v5"/><path d="M6 14v4"/><path d="M18 14v4"/></svg>}
                />
                <StatCard label="Occupied" value={occupiedCount} color="255, 8, 68" glow="rgba(255,8,68,0.3)"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                />
                <StatCard label="Available" value={availableCount} color="0, 230, 118" glow="rgba(0,230,118,0.3)"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                />
                <StatCard label="In Queue" value={waitingCount} color="255, 193, 7" glow="rgba(255,193,7,0.3)"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
                />
            </div>

            {/* Chair Grid */}
            <h2 className="section-title" style={{ marginTop: '10px' }}>Chair Status</h2>
            <div className="chair-grid">
                {chairs.length === 0 && (
                    <div className="empty-state">
                        <p>No chairs configured yet.</p>
                    </div>
                )}
                {chairs.map(chair => {
                    const activeCustomer = customers.find(c => c.chairId === chair.id && c.status === 'In Service');
                    const isOccupied = chair.isOccupied;
                    return (
                        <div
                            key={chair.id}
                            className={`chair-card ${isOccupied ? 'chair-occupied' : 'chair-available'}`}
                        >
                            <div className="chair-card-header">
                                <div className="chair-number">{chair.chairNumber}</div>
                                <span className={`badge ${isOccupied ? 'badge-occupied' : 'badge-active'}`}>
                                    {isOccupied ? 'Occupied' : 'Available'}
                                </span>
                            </div>

                            {isOccupied && activeCustomer ? (
                                <div className="chair-customer">
                                    <div className="customer-avatar">
                                        {activeCustomer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="customer-info">
                                        <h3 className="customer-name">{activeCustomer.name}</h3>
                                        <p className="customer-service">{activeCustomer.service}</p>
                                        <p className="customer-token">Token #{activeCustomer.tokenNumber}</p>
                                        {chair.occupiedSince && (
                                            <p className="customer-timer" style={{ marginTop: '5px', fontSize: '14px' }}>
                                                Time: <Timer startTime={chair.occupiedSince} />
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="chair-empty">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                                        <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/>
                                        <path d="M4 9h16v5H4z"/><path d="M8 9v5"/><path d="M16 9v5"/>
                                        <path d="M6 14v4"/><path d="M18 14v4"/>
                                    </svg>
                                    <p>Ready for next customer</p>
                                </div>
                            )}

                            {isOccupied && activeCustomer && (
                                <button
                                    className="btn btn-complete"
                                    onClick={() => handleComplete(activeCustomer.id)}
                                >
                                    ✓ Complete Haircut
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Dashboard;