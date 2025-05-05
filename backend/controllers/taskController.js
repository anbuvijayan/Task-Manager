const Task = require('../models/Task');
const mongoose = require('mongoose');

const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

// GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = { user: req.user._id };
        if (status) filter.status = status;

        let tasks = await Task.find(filter);
        tasks = tasks.map(task => {
            const completedCount = task.checklist.filter(item => item.completed).length;
            return { ...task.toObject(), completedChecklistCount: completedCount };
        });

        const summaryAgg = await Task.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const statusSummary = {
            all: summaryAgg.reduce((acc, cur) => acc + cur.count, 0),
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
        };

        summaryAgg.forEach(item => {
            if (item._id === "Pending") statusSummary.pendingTasks = item.count;
            if (item._id === "In Progress") statusSummary.inProgressTasks = item.count;
            if (item._id === "Completed") statusSummary.completedTasks = item.count;
        });

        res.json({ success: true, tasks, statusSummary });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const task = await Task.findOne({ _id: id, user: req.user._id });
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// POST /api/tasks
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, checklist, attachments: bodyAttachments = [] } = req.body;
        const uploadedFiles = req.files?.map(file => file.path) || [];

        const attachments = [...bodyAttachments, ...uploadedFiles];

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            user: req.user._id,
            checklist,
            attachments,
        });

        res.status(201).json({ success: true, message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const task = await Task.findOne({ _id: id, user: req.user._id });
        if (!task) {
            return res.status(403).json({ success: false, message: "Not authorized or task not found" });
        }

        const {
            title,
            description,
            priority,
            dueDate,
            status,
            checklist,
        } = req.body;

        const attachments = req.files?.map(file => file.path) || task.attachments;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (status !== undefined) task.status = status;
        if (attachments !== undefined) task.attachments = attachments;

        if (Array.isArray(checklist)) {
            task.checklist = checklist;
            const completedCount = checklist.filter(item => item.completed).length;
            task.progress = checklist.length > 0
                ? Math.round((completedCount / checklist.length) * 100)
                : 0;

            task.status = task.progress === 100
                ? "Completed"
                : task.progress > 0
                ? "In Progress"
                : "Pending";
        }

        const updatedTask = await task.save();
        res.json({ success: true, message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
        if (!task) {
            return res.status(403).json({ success: false, message: "Not authorized or task not found" });
        }

        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(403).json({ success: false, message: "Not authorized or task not found" });
        }

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
            task.checklist.forEach(item => item.completed = true);
            task.progress = 100;
        }

        await task.save();
        res.json({ success: true, message: "Task status updated", task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// PATCH /api/tasks/:id/checklist
const updateTaskChecklist = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(403).json({ success: false, message: "Not authorized or task not found" });
        }

        const { checklist } = req.body;
        task.checklist = checklist;

        const completedCount = checklist.filter(item => item.completed).length;
        task.progress = checklist.length > 0
            ? Math.round((completedCount / checklist.length) * 100)
            : 0;

        task.status = task.progress === 100
            ? "Completed"
            : task.progress > 0
            ? "In Progress"
            : "Pending";

        const updatedTask = await task.save();
        res.json({ success: true, message: "Checklist updated", task: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET /api/tasks/dashboard-data
const getDashboardData = async (req, res) => {
    try {
        const match = { user: req.user._id };

        const [totalTasks, pendingTasks, completedTasks, overdueTask] = await Promise.all([
            Task.countDocuments(match),
            Task.countDocuments({ ...match, status: "Pending" }),
            Task.countDocuments({ ...match, status: "Completed" }),
            Task.countDocuments({ ...match, status: { $ne: "Completed" }, dueDate: { $lt: new Date() } })
        ]);

        const statuses = ["Pending", "In Progress", "Completed"];
        const rawStatusDist = await Task.aggregate([
            { $match: match },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribution = statuses.reduce((acc, status) => {
            const key = status.replace(/\s+/g, "");
            acc[key] = rawStatusDist.find(i => i._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const priorities = ["Low", "Medium", "High"];
        const rawPriorityDist = await Task.aggregate([
            { $match: match },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPrioritiesLevels = priorities.reduce((acc, p) => {
            acc[p] = rawPriorityDist.find(i => i._id === p)?.count || 0;
            return acc;
        }, {});

        const recentTask = await Task.find(match)
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            success: true,
            statistics: { totalTasks, pendingTasks, completedTasks, overdueTask },
            charts: { taskDistribution, taskPrioritiesLevels },
            recentTask,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const toggleTaskPinned = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid task ID" });
        }

        const task = await Task.findOne({ _id: id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.pinned = !task.pinned;
        await task.save();

        res.json({
            success: true,
            message: `Task ${task.pinned ? 'pinned' : 'unpinned'} successfully`,
            pinned: task.pinned
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    toggleTaskPinned,
};
