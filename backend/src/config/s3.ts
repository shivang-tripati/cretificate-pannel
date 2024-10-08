import { S3Client, } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();
const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
})

export default s3Client;
