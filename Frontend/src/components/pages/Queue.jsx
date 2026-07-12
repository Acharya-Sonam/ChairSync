import { useEffect, useState } from "react";
import { customerService, chairService } from "../../services/api";

function Queue() {
    const [customers, setCustomers] = useState([]);
    const [chairs, setChairs] = useState([]);
    const [assigningId, setAssigningId] = useState(null);
    const [selectedChairs, setSelectedChairs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 15000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const [custRes, chairRes] = await Promise.all([
                customerService.getWaitingCustomers(),
                chairService.getChairs()
            ]);
            setCustomers(custRes.data);
            setChairs(chairRes.data);
        } catch (error) {
            console.error("Error loading queue data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (customerId) => {
        const chairId = selectedChairs[customerId];
        if (!chairId) return;
        setAssigningId(customerId);
        try {
            await customerService.assignChair(customerId, chairId);
            await loadData();
        } catch (error) {
            console.error("Error assigning chair", error);
        } finally {
            setAssigningId(null);
        }
    };

    const availableChairs = chairs.filter(c => !c.isOccupied);

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" />
                <p>Loading queue...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Queue Management</h1>
                    <p className="page-subtitle">Assign waiting customers to available chairs</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={loadData}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="queue-layout">
                {/* Waiting Queue */}
                <div className="queue-column">
                    <div className="column-header">
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Waiting Queue</h2>
                        <span className="badge badge-waiting">{customers.length} Waiting</span>
                    </div>

                    {customers.length === 0 ? (
                        <div className="empty-state card glass-panel">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '12px' }}>
                                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                            </svg>
                            <p>No customers currently waiting</p>
                        </div>
                    ) : (
                        <div className="queue-list">
                            {customers.map((customer, index) => (
                                <div key={customer.id} className="queue-item card enhanced-card">
                                    <div className="queue-item-top">
                                        <div className="queue-position">#{index + 1}</div>
                                        <div className="queue-customer-info">
                                            <div className="queue-avatar">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="queue-name">{customer.name}</h3>
                                                <p className="queue-service">{customer.service}</p>
                                            </div>
                                        </div>
                                        <div className="queue-token">Token #{customer.tokenNumber}</div>
                                    </div>

                                    <div className="queue-assign-row">
                                        <select
                                            className="input-field select-field"
                                            disabled={availableChairs.length === 0}
                                            value={selectedChairs[customer.id] || ''}
                                            onChange={(e) => setSelectedChairs(prev => ({ ...prev, [customer.id]: e.target.value }))}
                                        >
                                            <option value="">Select chair...</option>
                                            {availableChairs.map(chair => (
                                                <option key={chair.id} value={chair.id}>{chair.chairNumber}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-primary"
                                            disabled={availableChairs.length === 0 || !selectedChairs[customer.id] || assigningId === customer.id}
                                            onClick={() => handleAssign(customer.id)}
                                        >
                                            {assigningId === customer.id ? (
                                                <span className="spinner-sm" />
                                            ) : 'Assign'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chair Status Panel */}
                <div className="queue-column">
                    <div className="column-header">
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Chair Availability</h2>
                        <span className="badge badge-active">{availableChairs.length} Free</span>
                    </div>

                    <div className="chair-status-grid">
                        {chairs.map(chair => (
                            <div
                                key={chair.id}
                                className={`chair-card ${chair.isOccupied ? 'occupied' : 'available'}`}
                            >
                                <div className="chair-status-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/>
                                        <path d="M4 9h16v5H4z"/><path d="M8 9v5"/><path d="M16 9v5"/>
                                        <path d="M6 14v4"/><path d="M18 14v4"/>
                                    </svg>
                                </div>
                                <h3 className="chair-status-label">{chair.chairNumber}</h3>
                                <span className={`badge ${chair.isOccupied ? 'badge-occupied' : 'badge-active'}`}>
                                    {chair.isOccupied ? 'Occupied' : 'Free'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Queue;