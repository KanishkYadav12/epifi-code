import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICheck extends Document {
  monitorId: Types.ObjectId;
  statusCode: number | null;
  responseTimeMs: number;
  isUp: boolean;
  checkedAt: Date;
  error: string | null;
}

const checkSchema = new Schema<ICheck>({
  monitorId: { type: Schema.Types.ObjectId, ref: 'Monitor', required: true },
  statusCode: { type: Number, default: null },
  responseTimeMs: { type: Number, required: true },
  isUp: { type: Boolean, required: true },
  checkedAt: { type: Date, default: Date.now },
  error: { type: String, default: null }
});

checkSchema.index({ monitorId: 1, checkedAt: -1 });
checkSchema.index({ checkedAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model<ICheck>('Check', checkSchema);