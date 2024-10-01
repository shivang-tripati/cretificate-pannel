import mongoose, { Document, Schema } from "mongoose";

export interface IPredefinedEmail extends Document {
    email: string;
    description?: string;
    createdAt: Date;
}

const predefinedEmailSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const PredefinedEmail = mongoose.model<IPredefinedEmail>('PredefinedEmail', predefinedEmailSchema);
export default PredefinedEmail;
