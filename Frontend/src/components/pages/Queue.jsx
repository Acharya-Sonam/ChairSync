import { useEffect, useState } from "react";
import { customerService, chairService } from "../../services/api";

function Queue() {
    const [customers, setCustomers] = useState([]);
    const [chairs, setChairs] = useState([]);
    const [assigningId, setAssigningId] = useState(null);

    useEffect(() => {
        loadData();
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
        }
    };

    const handleAssign = async (customerId, chairId) => {
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

    return (
        <div>
            <h1 className="page-title">Digital Queue Management</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                
                {/* Waiting Queue List */}
                <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Waiting Queue
                        <span className="badge badge-waiting">{customers.length} Waiting</span>
                    </h2>
                    
                    {customers.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>No customers currently waiting.</p>
                    ) : (
                        customers.map(customer => (
                            <div key={customer.id} className="card" style={{ padding: '15px', borderLeft: '4px solid #f39c12' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', margin: '0 0 5px' }}>{customer.name}</h3>
                                        <p style={{ fontSize: '13px', margin: 0 }}>Service: {customer.service}</p>
                                    </div>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>
                                        #{customer.tokenNumber}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <select 
                                        className="input-field" 
                                        style={{ padding: '8px', fontSize: '14px', flex: 1 }}
                                        id={`select-chair-${customer.id}`}
                                        disabled={availableChairs.length === 0}
                                    >
                                        <option value="">Select Chair...</option>
                                        {availableChairs.map(chair => (
                                            <option key={chair.id} value={chair.id}>{chair.chairNumber}</option>
                                        ))}
                                    </select>
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ padding: '8px 15px', fontSize: '14px' }}
                                        disabled={availableChairs.length === 0 || assigningId === customer.id}
                                        onClick={() => {
                                            const select = document.getElementById(`select-chair-${customer.id}`);
                                            handleAssign(customer.id, select.value);
                                        }}
                                    >
                                        Assign
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Chair Status */}
                <div className="card glass-panel">
                    <h2 className="section-title">Chair Availability</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {chairs.map(chair => (
                            <div 
                                key={chair.id} 
                                className="card" 
                                style={{ 
                                    padding: '20px', 
                                    textAlign: 'center',
                                    border: chair.isOccupied ? '1px solid rgba(231, 76, 60, 0.5)' : '1px solid rgba(46, 204, 113, 0.5)',
                                    background: chair.isOccupied ? 'rgba(231, 76, 60, 0.05)' : 'rgba(46, 204, 113, 0.05)'
                                }}
                            >
                                <h3 style={{ fontSize: '24px', color: 'var(--text-h)', margin: '0 0 10px' }}>{chair.chairNumber}</h3>
                                <span className={`badge ${chair.isOccupied ? '' : 'badge-active'}`} style={{ background: chair.isOccupied ? 'rgba(231, 76, 60, 0.2)' : '', color: chair.isOccupied ? '#e74c3c' : '' }}>
                                    {chair.isOccupied ? "Occupied" : "Available"}
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