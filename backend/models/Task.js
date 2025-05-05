// models/Task.js

const mongoose = require('mongoose');

// ✅ Use "title" instead of "text" to match frontend
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    dueDate: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checklist: [todoSchema],
    attachments: [{ type: String }],
    progress: { type: Number, default: 0, min: 0, max: 100 },

    // ✅ NEW FIELD
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
