import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        billingAddress: ""
    });

    const [creating, setCreating] = useState(false);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/clients", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setClients(response.data.clients);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load clients"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = async (clientId) => {
    try {
        const token = localStorage.getItem("token");

        await api.delete(`/clients/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        await fetchClients();
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to delete client"
        );
    }
};

const handleEdit = async (client) => {
    const name = prompt("Enter client name:", client.name);
    const email = prompt("Enter client email:", client.email);
    const phone = prompt("Enter client phone:", client.phone);
    const billingAddress = prompt(
        "Enter billing address:",
        client.billingAddress
    );

    if (!name || !email || !phone || !billingAddress) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await api.put(`/clients/${client._id}`, {
            name,
            email,
            phone,
            billingAddress
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        await fetchClients();
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to update client"
        );
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.billingAddress
        ) {
            setError("All fields are required");
            return;
        }

        try {
            setCreating(true);

            const token = localStorage.getItem("token");

            await api.post("/clients", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFormData({
                name: "",
                email: "",
                phone: "",
                billingAddress: ""
            });

            await fetchClients();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create client"
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <Navbar />

            <main>
                <h1>Clients</h1>

                <h2>Add New Client</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Billing Address</label>
                        <textarea
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" disabled={creating}>
                        {creating ? "Creating..." : "Add Client"}
                    </button>
                </form>

                {error && <p>{error}</p>}

                <h2>My Clients</h2>

                {loading && <p>Loading clients...</p>}

                {!loading && !error && clients.length === 0 && (
                    <p>No clients found.</p>
                )}

                {!loading && clients.length > 0 && (
                    <div>
                        {clients.map((client) => (
                            <div key={client._id}>
                                <h3>{client.name}</h3>
                                <p>Email: {client.email}</p>
                                <p>Phone: {client.phone}</p>
                                <p>Address: {client.billingAddress}</p>

                                <button onClick={() => handleEdit(client)}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(client._id)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Clients;