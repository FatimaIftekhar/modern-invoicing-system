const Invoice = require("../models/Invoice");
const Client = require("../models/Client");

const createInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            clientId,
            items,
            taxPercentage,
            dueDate,
            status
        } = req.body;

        // Validate required fields
        if (!invoiceNumber || !clientId || !items || !dueDate) {
            return res.status(400).json({
                message: "Invoice number, client, items and due date are required"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Invoice must have at least one item"
            });
        }

        // Make sure the client belongs to the logged-in user
        const client = await Client.findOne({
            _id: clientId,
            userId: req.user.id
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        // Calculate subtotal
        let subtotal = 0;

        for (const item of items) {
            if (
                !item.description ||
                item.quantity <= 0 ||
                item.unitPrice < 0
            ) {
                return res.status(400).json({
                    message: "Invalid invoice item"
                });
            }

            subtotal += item.quantity * item.unitPrice;
        }

        // Calculate tax
        const tax = taxPercentage || 0;
        const taxAmount = subtotal * (tax / 100);

        // Calculate total
        const total = subtotal + taxAmount;

        // Create invoice
        const invoice = await Invoice.create({
            invoiceNumber,
            clientId,
            userId: req.user.id,
            items,
            subtotal,
            taxPercentage: tax,
            taxAmount,
            total,
            dueDate,
            status: status || "draft"
        });

        res.status(201).json({
            message: "Invoice created successfully",
            invoice
        });

    } catch (error) {
        console.error("Create invoice error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Invoice number already exists for this user"
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getInvoices = async (req, res) => {
    try {
        const { status, clientId, startDate, endDate } = req.query;

        const filter = {
            userId: req.user.id
        };

        // Filter by invoice status
        if (status) {
            filter.status = status;
        }

        // Filter by client
        if (clientId) {
            filter.clientId = clientId;
        }

        // Filter by date range
        if (startDate || endDate) {
            filter.dueDate = {};

            if (startDate) {
                filter.dueDate.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.dueDate.$lte = new Date(endDate);
            }
        }

        const invoices = await Invoice.find(filter)
            .populate("clientId", "name email phone billingAddress")
            .sort({ createdAt: -1 });

        res.status(200).json({
            invoices
        });

    } catch (error) {
        console.error("Get invoices error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate(
            "clientId",
            "name email phone billingAddress"
        ).populate(
        "userId",
        "name logo role"
    );
        

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            invoice
        });

    } catch (error) {
        console.error("Get invoice error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["draft", "sent", "paid", "overdue"];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid invoice status"
            });
        }

        const invoice = await Invoice.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            message: "Invoice status updated successfully",
            invoice
        });

    } catch (error) {
        console.error("Update invoice status error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoiceStatus
};