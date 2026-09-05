const premiumMiddleware = (req, res, next) => {
    if (req.user.role !== "premium") {
        return res.status(403).json({
            message: "Premium subscription required"
        });
    }

    next();
};

module.exports = premiumMiddleware;