import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav>
            <h2>Invoice System</h2>

            <div>
                <Link to="/dashboard">Dashboard</Link>
                {" | "}
                <Link to="/clients">Clients</Link>
                {" | "}
                <Link to="/invoices">Invoices</Link>

                {user?.role === "premium" && (
                    <>
                        {" | "}
                        <Link to="/settings">Settings</Link>
                    </>
                )}

                {" | "}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;