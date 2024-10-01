import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'user' | 'admin';
    tokens: string[];  // Array to store auth tokens for session management
    createdAt: Date;
}

// User schema definition
const userSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'admin' },
    password: { type: String, required: true },
    tokens: [{ type: String }],  // Storing auth tokens for sessions
    createdAt: { type: Date, default: Date.now },
});



const User = mongoose.model<IUser>('User', userSchema);
export default User;
