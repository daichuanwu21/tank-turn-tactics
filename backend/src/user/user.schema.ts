import { Schema } from "mongoose";
import validator from "validator";

interface IUserSchema {
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  passwordSalt: string;
  creationDate: Date;
}

const userSchema = new Schema<IUserSchema>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Not a valid email address."],
  },
  emailVerified: { type: Boolean, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  creationDate: { type: Date, required: true },
});

export default userSchema;
export { IUserSchema };
