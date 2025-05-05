const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get logged-in user with task stats
// @route   GET /api/users
// @access  Private
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const [pendingTask, inprogressTask, completedTask] = await Promise.all([
            Task.countDocuments({ user: req.user._id, status: "Pending" }),
            Task.countDocuments({ user: req.user._id, status: "In Progress" }),
            Task.countDocuments({ user: req.user._id, status: "Completed" })
        ]);

        res.json({
            success: true,
            user: {
                ...user.toObject(),
                pendingTask,
                inprogressTask,
                completedTask,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.password) user.password = req.body.password;
        if (req.body.profileImageUrl) user.profileImageUrl = req.body.profileImageUrl;

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profileImageUrl: updatedUser.profileImageUrl
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    getUser,
    updateUserProfile
};
