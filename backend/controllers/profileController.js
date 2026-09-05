const User = require("../models/User");

const updateLogo = async (req, res) => {
    try {
        const { logo } = req.body;

        if (!logo) {
            return res.status(400).json({
                message: "Logo URL is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { logo },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Logo updated successfully",
            user
        });
    } catch (error) {
        console.error("Update logo error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    updateLogo
};