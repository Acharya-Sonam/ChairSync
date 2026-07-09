import { useEffect, useState } from "react";
import api from "../services/api";
import "./ChairGrid.css";

function ChairGrid() {
    const [chairs, setChairs] = useState([]);

    useEffect(() => {
        fetchChairs();
    }, []);

    const fetchChairs = async () => {
        try {
            const response = await api.get("/chairs");
            setChairs(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h2>💈 ChairSync</h2>

            <div className="grid">
                {chairs.map((chair) => (
                    <div
                        key={chair.id}
                        className={chair.isOccupied ? "occupied" : "available"}
                    >
                        <h3>{chair.chairNumber}</h3>

                        <p>
                            {chair.isOccupied ? "🔴 Occupied" : "🟢 Available"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChairGrid;