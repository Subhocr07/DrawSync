import mongoose from 'mongoose';

const strokeSchema = new mongoose.Schema(
  {
    points: [{ x: Number, y: Number }],
    color: { type: String, default: '#000000' },
    width: { type: Number, default: 2 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const canvasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    strokes: [strokeSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Canvas', canvasSchema);


