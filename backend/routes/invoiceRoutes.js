const express = require("express");

const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoiceStatus
} = require("../controllers/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createInvoice);
router.get("/", authMiddleware, getInvoices);
router.get("/:id", authMiddleware, getInvoiceById);
router.put("/:id", authMiddleware, updateInvoiceStatus);

module.exports = router;