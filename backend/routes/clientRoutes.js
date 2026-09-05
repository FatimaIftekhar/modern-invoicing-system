const express = require("express");

const {
    createClient,
    getClients,
    updateClient,
    deleteClient
} = require("../controllers/clientController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createClient);
router.get("/", authMiddleware, getClients);
router.put("/:id", authMiddleware, updateClient);
router.delete("/:id", authMiddleware, deleteClient);

module.exports = router;