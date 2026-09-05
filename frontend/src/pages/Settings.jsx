import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Settings() {
    const [logo, setLogo] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!logo) {
            setError("Please enter a logo URL");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await api.put(
                "/profile/logo",
                { logo },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Logo updated successfully");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update logo"
            );
        }
    };

    return (
        <div>
            <Navbar />

            <main>
                <h1>Premium Settings</h1>

                <p>Customize your invoice branding.</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Logo URL</label>

                        <input
                            type="url"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>

                    {error && <p>{error}</p>}
                    {message && <p>{message}</p>}

                    <button type="submit">
                        Save Logo
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Settings;