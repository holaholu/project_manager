import { Request, Response } from 'express';
import Team from '../models/Team';

// Get all team members
export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const members = await Team.find({ createdBy: req.user?._id });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error });
  }
};

// Add team member
export const addTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;

    // Check if member already exists
    const memberExists = await Team.findOne({ email, createdBy: req.user?._id });
    if (memberExists) {
      res.status(400).json({ message: 'Team member already exists' });
      return;
    }

    const member = await Team.create({
      name,
      email,
      role,
      createdBy: req.user?._id,
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error adding team member', error });
  }
};

// Update team member
export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;
    const member = await Team.findOne({
      _id: req.params.id,
      createdBy: req.user?._id,
    });

    if (!member) {
      res.status(404).json({ message: 'Team member not found' });
      return;
    }

    member.name = name;
    member.email = email;
    member.role = role;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team member', error });
  }
};

// Delete team member
export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await Team.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user?._id,
    });

    if (!member) {
      res.status(404).json({ message: 'Team member not found' });
      return;
    }

    res.json({ message: 'Team member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member', error });
  }
};
