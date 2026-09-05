import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [clientFilter, setClientFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [clients, setClients] = useState([]);

const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientId: "",
    taxPercentage: 0,
    dueDate: "",
    status: "draft"
});

const [items, setItems] = useState([
    {
        description: "",
        quantity: 1,
        unitPrice: 0
    }
]);

const [creating, setCreating] = useState(false);
const subtotal = items.reduce(
    (sum, item) =>
        sum + Number(item.quantity) * Number(item.unitPrice),
    0
);

const taxAmount = subtotal * (Number(formData.taxPercentage) / 100);

const total = subtotal + taxAmount;

    const fetchInvoices = async (
    status = statusFilter,
    clientId = clientFilter,
    start = startDate,
    end = endDate
) => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get("/invoices", {
            params: {
                status: status || undefined,
                clientId: clientId || undefined,
                startDate: start || undefined,
                endDate: end || undefined
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setInvoices(response.data.invoices);
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to load invoices"
        );
    } finally {
        setLoading(false);
    }
};

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
    }
};
const handleFormChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};
const handleItemChange = (index, e) => {
    const updatedItems = [...items];

    updatedItems[index] = {
        ...updatedItems[index],
        [e.target.name]: e.target.value
    };

    setItems(updatedItems);
};
const addItem = () => {
    setItems([
        ...items,
        {
            description: "",
            quantity: 1,
            unitPrice: 0
        }
    ]);
};
const removeItem = (index) => {
    if (items.length === 1) {
        return;
    }

    setItems(items.filter((_, i) => i !== index));
};
const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
        !formData.invoiceNumber ||
        !formData.clientId ||
        !formData.dueDate
    ) {
        setError("Invoice number, client and due date are required");
        return;
    }

    for (const item of items) {
        if (
            !item.description ||
            Number(item.quantity) <= 0 ||
            Number(item.unitPrice) < 0
        ) {
            setError("Please enter valid invoice items");
            return;
        }
    }

    try {
        setCreating(true);

        const token = localStorage.getItem("token");

        await api.post(
            "/invoices",
            {
                ...formData,
                taxPercentage: Number(formData.taxPercentage),
                items: items.map((item) => ({
                    ...item,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice)
                }))
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setFormData({
            invoiceNumber: "",
            clientId: "",
            taxPercentage: 0,
            dueDate: "",
            status: "draft"
        });

        setItems([
            {
                description: "",
                quantity: 1,
                unitPrice: 0
            }
        ]);

        await fetchInvoices();
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to create invoice"
        );
    } finally {
        setCreating(false);
    }
};

    useEffect(() => {
        fetchInvoices();
        fetchClients();
    }, []);

    return (
    <div>
        <Navbar />

        <main>
            <h1>Invoices</h1>

            <div>
                <label>Filter by Client: </label>

                <select
                    value={clientFilter}
                    onChange={(e) => {
                        const newClient = e.target.value;
                        setClientFilter(newClient);
                        fetchInvoices(statusFilter, newClient);
                    }}
                >
                    <option value="">All Clients</option>

                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Start Date: </label>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                        const newStartDate = e.target.value;
                        setStartDate(newStartDate);
                        fetchInvoices(
                            statusFilter,
                            clientFilter,
                            newStartDate,
                            endDate
                        );
                    }}
                />
            </div>

            <div>
                <label>End Date: </label>

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                        const newEndDate = e.target.value;
                        setEndDate(newEndDate);
                        fetchInvoices(
                            statusFilter,
                            clientFilter,
                            startDate,
                            newEndDate
                        );
                    }}
                />
            </div>

            <h2>Create Invoice</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Invoice Number</label>
                    <input
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleFormChange}
                        placeholder="INV-002"
                    />
                </div>

                <div>
                    <label>Client</label>
                    <select
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleFormChange}
                    >
                        <option value="">Select a client</option>

                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Tax (%)</label>
                    <input
                        type="number"
                        name="taxPercentage"
                        value={formData.taxPercentage}
                        onChange={handleFormChange}
                        min="0"
                    />
                </div>

                <div>
                    <label>Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleFormChange}
                    />
                </div>

                <h3>Invoice Items</h3>

                {items.map((item, index) => (
                    <div key={index}>
                        <input
                            name="description"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, e)}
                        />

                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleItemChange(index, e)}
                        />

                        <input
                            type="number"
                            name="unitPrice"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            min="0"
                            onChange={(e) => handleItemChange(index, e)}
                        />

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addItem}>
                    Add Item
                </button>

                <div>
                    <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                    <p>Tax: ₹{taxAmount.toFixed(2)}</p>
                    <p>Total: ₹{total.toFixed(2)}</p>
                </div>

                <br />
                <br />

                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Invoice"}
                </button>
            </form>

            {loading && <p>Loading invoices...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && invoices.length === 0 && (
                <p>No invoices found.</p>
            )}

            {!loading && invoices.length > 0 && (
                <div>
                    {invoices.map((invoice) => (
                        <div key={invoice._id}>
                            <h3>
                                <a href={`/invoices/${invoice._id}`}>
                                    {invoice.invoiceNumber}
                                </a>
                            </h3>

                            <a href={`/invoices/${invoice._id}`}>
                                View Invoice
                            </a>

                            <p>
                                Client: {invoice.clientId?.name}
                            </p>

                            <p>
                                Total: ₹{invoice.total}
                            </p>

                            <p>
                                Due Date:{" "}
                                {new Date(
                                    invoice.dueDate
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                Status: {invoice.status}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    </div>
);
}

export default Invoices;