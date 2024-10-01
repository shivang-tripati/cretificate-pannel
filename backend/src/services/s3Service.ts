import s3Client from '../config/s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();


const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

// Upload PDF to S3
export const uploadCertificatePdf = async (fileBuffer: Buffer, fileName: string, userId: string, certificateId : string) => {
    const fileKey = `__certificates/${userId}/${fileName}_${certificateId}.pdf`;

    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: 'application/pdf',
    }

    const command = new PutObjectCommand(uploadParams);

    try {
        const responses = await s3Client.send(command);
        console.log(`File uploaded successfully: ${fileKey}`);
        console.log(`Response: ${JSON.stringify(responses)}`);
        return fileKey; // Return file path for storage in DB
    } catch (error: any) {
        console.error(`Error uploading file: ${error.message}`);
        throw new Error(`S3 upload failed: ${error.message}`);
    }
};

// Delete PDF from S3
export const deleteCertificatePdf = async (pdfKey: string) => {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: pdfKey,
    });

    try {
        await s3Client.send(command);
        console.log(`File deleted successfully: ${pdfKey}`);
    } catch (error: any) {
        console.error(`Error deleting file: ${error.message}`);
        throw new Error(`S3 delete failed: ${error.message}`);
    }
};


  