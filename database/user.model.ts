import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username?: string; 
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
  email: { type: String, required: true, unique: true },
  password: { type: String },
  portfolioWebsite: { type: String },
  bio: { type: String },
  picture: { type: String, required: true },
  location: { type: String },
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
