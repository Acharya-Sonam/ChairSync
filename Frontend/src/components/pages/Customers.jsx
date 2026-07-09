import { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', service: 'Haircut', tokenNumber: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerService.getCustomers();
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Generate a simple token number for now based on current count
            const token = customers.length + 1;
            await customerService.addCustomer({ ...newCustomer, tokenNumber: token });
            setNewCustomer({ name: '', phone: '', service: 'Haircut', tokenNumber: 0 });
            fetchCustomers();
        } catch (error) {
            console.error("Error adding customer:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Customer Registration</h1>
            
            <div className="card" style={{ marginBottom: '30px' }}>
                <h2 className="section-title">Add New Walk-in</h2>
                <form onSubmit={handleAddCustomer} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Customer Name" 
                        className="input-field" 
                        style={{ flex: 1, minWidth: '200px' }}
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="input-field" 
                        style={{ flex: 1, minWidth: '150px' }}
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        required
                    />
                    <select 
                        className="input-field" 
                        style={{ flex: 1, minWidth: '150px' }}
                        value={newCustomer.service}
                        onChange={(e) => setNewCustomer({...newCustomer, service: e.target.value})}
                    >
                        <option value="Haircut">Haircut</option>
                        <option value="Beard Trim">Beard Trim</option>
                        <option value="Hair Coloring">Hair Coloring</option>
                        <option value="Full Package">Full Package</option>
                    </select>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add to Queue'}
                    </button>
                </form>
            </div>

            <div className="card glass-panel">
                <h2 className="section-title">All Customers</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table>
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
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No customers registered yet.</td>
                                </tr>
                            ) : (
                                customers.map(c => (
                                    <tr key={c.id}>
                                        <td><strong>#{c.tokenNumber}</strong></td>
                                        <td>{c.name}</td>
                                        <td>{c.phone}</td>
                                        <td>{c.service}</td>
                                        <td>
                                            <span className={`badge ${c.status === 'Waiting' ? 'badge-waiting' : (c.status === 'In Service' ? 'badge-active' : '')}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Customers;