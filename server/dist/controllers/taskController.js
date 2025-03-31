"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getProjectTasks = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const Project_1 = __importDefault(require("../models/Project"));
// Get tasks for user (tasks from user's projects or assigned to user)
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        // First, get all projects where user is creator or member
        const userProjects = yield Project_1.default.find({
            $or: [
                { createdBy: userId },
                { members: userId }
            ]
        }).select('_id');
        const projectIds = userProjects.map(project => project._id);
        // Then get tasks that either:
        // 1. Belong to user's projects, or
        // 2. Are assigned to the user
        const tasks = yield Task_1.default.find({
            $or: [
                { project: { $in: projectIds } },
                { assignedTo: userId },
                { createdBy: userId }
            ]
        })
            .populate('project', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});
exports.getTasks = getTasks;
// Get tasks by project
const getProjectTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching project tasks', error });
    }
});
exports.getProjectTasks = getProjectTasks;
// Get single task
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id)
            .populate('project', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
});
exports.getTask = getTask;
// Create task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const task = new Task_1.default(Object.assign(Object.assign({}, req.body), { createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id }));
        const savedTask = yield task.save();
        res.status(201).json(savedTask);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
});
exports.createTask = createTask;
// Update task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
});
exports.updateTask = updateTask;
// Delete task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});
exports.deleteTask = deleteTask;
