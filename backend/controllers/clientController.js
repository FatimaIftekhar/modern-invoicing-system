const Client = require("../models/Client");

// Create a new client
const createClient = async (req, res) => {
    try {
        const { name, email, phone, billingAddress } = req.body;

        if (!name || !email || !phone || !billingAddress) {
            return res.status(400).json({
                message: "All client fields are required"
            });
        }

        const client = await Client.create({
            name,
            email,
            phone,
            billingAddress,
            userId: req.user.id
        });

        res.status(201).json({
            message: "Client created successfully",
            client
        });
    } catch (error) {
        console.error("Create client error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get all clients of the logged-in user
const getClients = async (req, res) => {
    try {
        const clients = await Client.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            clients
        });
    } catch (error) {
        console.error("Get clients error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update a client
const updateClient = async (req, res) => {
    try {
        const { name, email, phone, billingAddress } = req.body;

        if (!name || !email || !phone || !billingAddress) {
            return res.status(400).json({
                message: "All client fields are required"
            });
        }

        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                name,
                email,
                phone,
                billingAddress
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            message: "Client updated successfully",
            client
        });
    } catch (error) {
        console.error("Update client error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// Delete a client
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            message: "Client deleted successfully"
        });
    } catch (error) {
        console.error("Delete client error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient
};