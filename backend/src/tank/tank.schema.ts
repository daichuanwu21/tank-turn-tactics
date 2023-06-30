import { Schema, Types } from "mongoose";

interface ITankSchema {
  healthPoints: number;
  actionPoints: number;
  range: number;
  positionX: number;
  positionY: number;
  userId: Types.ObjectId;
}

const tankSchema = new Schema<ITankSchema>({
  healthPoints: { type: Number, required: true },
  actionPoints: { type: Number, required: true },
  range: { type: Number, required: true },
  positionX: { type: Number, required: true },
  positionY: { type: Number, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
});

export default tankSchema;
export { ITankSchema };
