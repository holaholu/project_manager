import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  status: string;
  progress: number;
  dueDate: Date;
  tasks?: mongoose.Types.ObjectId[];
  members?: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    default: 'Not Started',
    enum: ['Not Started', 'In Progress', 'Completed']
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dueDate: { type: Date, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema);
