const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);


const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            trim: true
        },

        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: {
            type: [invoiceItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Invoice must have at least one item"
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        taxPercentage: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        taxAmount: {
            type: Number,
            required: true,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "sent", "paid", "overdue"],
            default: "draft"
        }
    },
    { timestamps: true }
);


// Invoice number must be unique for each user
invoiceSchema.index(
    { userId: 1, invoiceNumber: 1 },
    { unique: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);