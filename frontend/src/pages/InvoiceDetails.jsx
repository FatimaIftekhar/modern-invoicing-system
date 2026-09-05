import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function InvoiceDetails() {
    const { id } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(`/invoices/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setInvoice(response.data.invoice);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load invoice"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const handleMarkPaid = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/invoices/${id}`,
                { status: "paid" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchInvoice();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update invoice status"
            );
        }
    };

    if (loading) {
        return <p>Loading invoice...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!invoice) {
        return <p>Invoice not found</p>;
    }

    return (
        <div>
            <Navbar />

            <main>
                {invoice.userId?.logo && (
    <img
        src={invoice.userId.logo}
        alt="Business Logo"
        style={{
            maxWidth: "200px",
            maxHeight: "80px",
            objectFit: "contain"
        }}
    />
)}
                <h1>Invoice {invoice.invoiceNumber}</h1>

                <h2>Client</h2>
                <p>Name: {invoice.clientId.name}</p>
                <p>Email: {invoice.clientId.email}</p>
                <p>Phone: {invoice.clientId.phone}</p>
                <p>Billing Address: {invoice.clientId.billingAddress}</p>

                <h2>Invoice Items</h2>

                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.unitPrice}</td>
                                <td>
                                    ₹{item.quantity * item.unitPrice}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Summary</h2>

                <p>Subtotal: ₹{invoice.subtotal}</p>
                <p>
                    Tax ({invoice.taxPercentage}%): ₹
                    {invoice.taxAmount}
                </p>
                <h3>Total: ₹{invoice.total}</h3>

                <p>
                    Due Date:{" "}
                    {new Date(invoice.dueDate).toLocaleDateString()}
                </p>

                <p>
                    Status: <strong>{invoice.status}</strong>
                </p>

                {invoice.status !== "paid" && (
                    <button onClick={handleMarkPaid}>
                        Mark as Paid
                    </button>
                )}
                <button onClick={() => window.print()}>
                    Print Invoice
                </button>
            </main>
        </div>
    );
}

export default InvoiceDetails;