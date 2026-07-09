import { useState, useEffect } from 'react';
import { customerService, chairService } from '../../services/api';

function Dashboard() {
    const [chairs, setChairs] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadDashboardData();
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

    return (
        <div>
            <h1 className="page-title">Real-Time Chair Monitoring</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {chairs.map(chair => {
                    // Find if there's a customer currently in this chair
                    const activeCustomer = customers.find(c => c.chairId === chair.id && c.status === 'In Service');

                    return (
                        <div 
                            key={chair.id} 
                            className="card glass-panel"
                            style={{
                                borderTop: chair.isOccupied ? '4px solid #e74c3c' : '4px solid #2ecc71',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '200px'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h2 className="section-title" style={{ margin: 0 }}>{chair.chairNumber}</h2>
                                    <span className={`badge ${chair.isOccupied ? '' : 'badge-active'}`} style={{ background: chair.isOccupied ? 'rgba(231, 76, 60, 0.2)' : '', color: chair.isOccupied ? '#e74c3c' : '' }}>
                                        {chair.isOccupied ? "Occupied" : "Available"}
                                    </span>
                                </div>
                                
                                {chair.isOccupied && activeCustomer ? (
                                    <div style={{ padding: '15px', background: 'var(--bg-panel-hover)', borderRadius: '8px' }}>
                                        <h3 style={{ fontSize: '18px', margin: '0 0 5px', color: 'var(--accent)' }}>{activeCustomer.name}</h3>
                                        <p style={{ margin: 0, fontSize: '14px' }}>Service: {activeCustomer.service}</p>
                                        <p style={{ margin: '5px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>Token: #{activeCustomer.tokenNumber}</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', height: '100px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        Ready for next customer
                                    </div>
                                )}
                            </div>

                            {chair.isOccupied && activeCustomer && (
                                <button 
                                    className="btn btn-secondary" 
                                    style={{ marginTop: '20px', width: '100%' }}
                                    onClick={() => handleComplete(activeCustomer.id)}
                                >
                                    Complete Haircut
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