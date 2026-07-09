import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <div style={{ padding: '0 10px', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--accent)', fontSize: '28px', letterSpacing: '-1px' }}>💈 ChairSync</h2>
            </div>

            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Dashboard
            </NavLink>

            <NavLink to="/queue" className={({ isActive }) => (isActive ? "active" : "")}>
                Queue
            </NavLink>

            <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : "")}>
                Customers
            </NavLink>
        </div>
    );
}

export default Sidebar;