import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  email: string;
  role: string;
  createdBy: mongoose.Types.ObjectId;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITeam>('Team', teamSchema);
