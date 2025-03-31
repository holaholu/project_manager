import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import Project from '../models/Project';

// Get tasks for user (tasks from user's projects or assigned to user)
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // First, get all projects where user is creator or member
    const userProjects = await Project.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    }).select('_id');

    const projectIds = userProjects.map(project => project._id);

    // Then get tasks that either:
    // 1. Belong to user's projects, or
    // 2. Are assigned to the user
    const tasks = await Task.find({
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Get tasks by project
export const getProjectTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project tasks', error });
  }
};

// Get single task
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Create task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user?._id, // Assuming user is attached by auth middleware
    });
    
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
