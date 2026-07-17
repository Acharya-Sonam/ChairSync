import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { chairService } from "../../services/api";
import "./Landing.css";

const SERVICES = [
    { name: "Haircut", price: 200 },
    { name: "Beard Trim", price: 100 },
    { name: "Hair Coloring", price: 500 },
    { name: "Full Package", price: 700 },
];

function ChairStrip() {
    const [chairs, setChairs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = () => {
            chairService.getPublicStatus()
                .then((res) => setChairs(res.data))
                .catch(() => { })
                .finally(() => setLoading(false));
        };
        load();
        const id = setInterval(load, 10000);
        return () => clearInterval(id);
    }, []);

    if (loading) return <p className="landing-muted">Checking chairs…</p>;

    const free = chairs.filter((c) => !c.isOccupied).length;

    return (
        <div className="chair-strip">
            <p className="chair-strip-summary">
                {free} of {chairs.length} chairs free right now
            </p>
            <div className="chair-strip-dots">
                {chairs.map((c) => (
                    <div key={c.id} className={`chair-dot ${c.isOccupied ? "busy" : "free"}`} title={c.chairNumber}>
                        {c.chairNumber.replace("Chair ", "")}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Landing() {
    return (
        <div className="landing">
            <header className="landing-nav">
                <div className="landing-brand">💈 ChairSync</div>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <Link to="/login" className="landing-staff-link">Staff Login</Link>
                </nav>
            </header>

            <section id="home" className="landing-section landing-hero">
                <h1>Fresh Cuts, No Waiting Around</h1>
                <p>Check chair availability from home before you walk in.</p>
                <ChairStrip />
            </section>

            <section id="about" className="landing-section landing-about">
                <h2>About Us</h2>
                <p>
                    ChairSync barbershop is all about clean cuts and even cleaner queue management.
                    Nine chairs, a full lineup of services, and a system that keeps you from
                    waiting around for no reason.
                </p>
            </section>

            <section id="services" className="landing-section landing-services">
                <h2>Services & Pricing</h2>
                <div className="services-grid">
                    {SERVICES.map((s) => (
                        <div key={s.name} className="service-card">
                            <span className="service-name">{s.name}</span>
                            <span className="service-price">Rs.{s.price}</span>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="landing-footer">
                <p>© {new Date().getFullYear()} ChairSync Barber Management</p>
            </footer>
        </div>
    );
}

export default Landing;
