import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';

// Get user's projects (created by user or where user is a member)
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Auth User:', req.user); // Debug log
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    console.log('Searching for projects with userId:', userId); // Debug log
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    })
      .populate('tasks')
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    console.log('Found projects:', projects.length); // Debug log
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

// Get single project
export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('tasks')
      .populate('members', 'name email')
      .populate('createdBy', 'name email');
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
};

// Create project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user?._id, // Assuming user is attached by auth middleware
    });
    
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
};
