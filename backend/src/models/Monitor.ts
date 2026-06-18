import mongoose, { Schema, Document } from 'mongoose';

export interface IMonitor extends Document {
  name: string;
  url: string;
  createdAt: Date;
}

const monitorSchema = new Schema<IMonitor>({
  name: { type: String, required: true },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^https?:\/\//.test(v),
      message: 'URL must start with http:// or https://'
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMonitor>('Monitor', monitorSchema);