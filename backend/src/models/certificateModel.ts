import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  title: string;
  description?: string; // Optional field
  date: Date;
  qrCodeUrl: string;
  s3Url: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: { userId: mongoose.Types.ObjectId; updatedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema: Schema = new Schema(
  {
    certificateId: { type: String, required: true }, // Corrected typo
    title: { type: String, required: true },
    description: { type: String }, // Optional field for certificate description
    date: { type: Date, default: Date.now }, // Date of issuance
    qrCodeUrl: { type: String, required: true }, // URL to the generated QR code
    s3Url: { type: String, required: true }, // URL to the uploaded PDF
    status: { type: String, default: 'vaild' }, // True for valid, false for invalid
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Creator reference
    updatedBy: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' }, // Reference to the user who updated
        updatedAt: { type: Date, default: Date.now }, // Time of update
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
export default Certificate;
