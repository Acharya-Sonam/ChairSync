import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../../services/api";

const navItems = [
    {
        to: "/app",
        label: "Dashboard",
        end: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        )
    },
    {
        to: "/app/queue",
        label: "Queue",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        )
    },
    {
        to: "/app/customers",
        label: "Customers",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        )
    },
    {
        to: "/app/status",
        label: "Chair Status",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        )
    }
];

function Sidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        authService.me().then((res) => setUser(res.data)).catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            // Even if the request fails, still send the user to login
        }
        navigate("/login");
    };

    const items = user?.role === "Admin"
        ? [
            ...navItems,
            {
                to: "/app/staff-approvals",
                label: "Staff Approvals",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                    </svg>
                )
            }
        ]
        : navItems;

    return (
        <div className="sidebar">
            {/* Logo / Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-logo">💈</div>
                <div>
                    <h2 className="sidebar-title">ChairSync</h2>
                    <p className="sidebar-subtitle">Barber Management</p>
                </div>
            </div>

            <div className="sidebar-divider" />

            <nav className="sidebar-nav">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {user && (
                    <div className="sidebar-status" style={{ marginBottom: 8 }}>
                        <span>{user.name}</span>
                        <span className={`badge ${user.role === "Admin" ? "badge-amber" : "badge-blue"}`} style={{ marginLeft: 6 }}>
                            {user.role}
                        </span>
                    </div>
                )}
                <div className="sidebar-status">
                    <span className="status-dot" />
                    <span>System Online</span>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;