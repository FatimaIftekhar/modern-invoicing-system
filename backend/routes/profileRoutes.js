const express = require("express");

const { updateLogo } = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const premiumMiddleware = require("../middleware/premiumMiddleware");

const router = express.Router();

router.put(
    "/logo",
    authMiddleware,
    premiumMiddleware,
    updateLogo
);

module.exports = router;