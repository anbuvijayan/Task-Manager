const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    toggleTaskPinned, // ✅ New controller
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

// Multer setup for attachments
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// All routes require authentication
router.use(protect);

// GET /api/tasks - get all tasks for user
router.get('/', getTasks);

// GET /api/tasks/dashboard-data - dashboard analytics
router.get('/dashboard-data', getDashboardData);

// GET /api/tasks/:id - get a specific task
router.get('/:id', getTaskById);

// POST /api/tasks - create a task with optional attachments
router.post('/', upload.array('attachments'), createTask);

// PUT /api/tasks/:id - update a task (with attachments)
router.put('/:id', upload.array('attachments'), updateTask);

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', deleteTask);

// PATCH /api/tasks/:id/status - update task status
router.patch('/:id/status', updateTaskStatus);

// PATCH /api/tasks/:id/checklist - update checklist
router.patch('/:id/checklist', updateTaskChecklist);

// ✅ PATCH /api/tasks/:id/pin - toggle pin/unpin task
router.patch('/:id/pin', toggleTaskPinned);


module.exports = router;
