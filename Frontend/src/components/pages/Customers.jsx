import { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

const STATUS_BADGE = {
    'Waiting': 'badge-amber',
    'In Service': 'badge-blue',
    'Completed': 'badge-green',
};

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', service: 'Haircut', tokenNumber: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerService.getCustomers();
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setFetching(false);
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = customers.length + 1;
            await customerService.addCustomer({ ...newCustomer, tokenNumber: token, status: 'Waiting' });
            setNewCustomer({ name: '', phone: '', service: 'Haircut', tokenNumber: 0 });
            fetchCustomers();
        } catch (error) {
            console.error("Error adding customer:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = filter === 'All' ? customers : customers.filter(c => c.status === filter);
    const waitingCount = customers.filter(c => c.status === 'Waiting').length;
    const inServiceCount = customers.filter(c => c.status === 'In Service').length;
    const completedCount = customers.filter(c => c.status === 'Completed').length;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Customer Registration</h1>
                    <p className="page-subtitle">Register walk-in customers and track service status</p>
                </div>
            </div>

            {/* Add Customer Form */}
            <div className="card glass-panel form-card">
                <h2 className="section-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', color: 'var(--accent)' }}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Add New Walk-in
                </h2>
                <form onSubmit={handleAddCustomer} className="add-customer-form">
                    <div className="form-group">
                        <label className="form-label">Customer Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            className="input-field"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            placeholder="e.g. 98XXXXXXXX"
                            className="input-field"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Service</label>
                        <select
                            className="input-field"
                            value={newCustomer.service}
                            onChange={(e) => setNewCustomer({ ...newCustomer, service: e.target.value })}
                        >
                            <option value="Haircut">✂️ Haircut</option>
                            <option value="Beard Trim">🪒 Beard Trim</option>
                            <option value="Hair Coloring">🎨 Hair Coloring</option>
                            <option value="Full Package">💈 Full Package</option>
                        </select>
                    </div>
                    <div className="form-action">
                        <button type="submit" className="btn btn-cta" disabled={isLoading} style={{ width: '100%', marginTop: '8px' }}>
                            {isLoading ? (
                                <><span className="spinner-sm" /> Adding...</>
                            ) : (
                                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> Add to Queue</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Summary Chips */}
            <div className="status-summary">
                {[
                    { label: 'All', count: customers.length },
                    { label: 'Waiting', count: waitingCount },
                    { label: 'In Service', count: inServiceCount },
                    { label: 'Completed', count: completedCount },
                ].map(item => (
                    <button
                        key={item.label}
                        className={`filter-chip ${filter === item.label ? 'active' : ''}`}
                        onClick={() => setFilter(item.label)}
                    >
                        {item.label} <span className="chip-count">{item.count}</span>
                    </button>
                ))}
            </div>

            {/* Customer Table */}
            <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-header">
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                        {filter === 'All' ? 'All Customers' : `${filter} Customers`}
                    </h2>
                    <button className="btn btn-secondary btn-sm" onClick={fetchCustomers}>Refresh</button>
                </div>

                {fetching ? (
                    <div className="page-loading" style={{ minHeight: '200px' }}>
                        <div className="spinner" /><p>Loading customers...</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="customers-table">
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="table-empty">No customers found.</td>
                                    </tr>
                                ) : (
                                    filtered.map(c => (
                                        <tr key={c.id}>
                                            <td><span className="token-badge">#{c.tokenNumber}</span></td>
                                            <td>
                                                <div className="table-customer">
                                                    <div className="table-avatar">{c.name.charAt(0).toUpperCase()}</div>
                                                    <span>{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="muted">{c.phone}</td>
                                            <td>{c.service}</td>
                                            <td>
                                                <span className={`badge ${STATUS_BADGE[c.status] || ''}`}>{c.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Customers;