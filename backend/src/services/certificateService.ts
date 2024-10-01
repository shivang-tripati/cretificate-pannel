
import Certificate, {ICertificate} from '../models/certificateModel';
import { generateQRCode } from '../utils/qrCode'; 
import { uploadCertificatePdf, deleteCertificatePdf } from './s3Service';

import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!
const certificateId = uuidv4();
const extractPath = (url: string): string => {
  const pathStart = url.indexOf('__certificates');
  if (pathStart !== -1) {
    return url.substring(pathStart + '__certificates/'.length);
  }
  return '';  // return empty if "__certificates" is not found
};



 const createCertificate = async (data: any): Promise<ICertificate> => {
 
    const certificateData = {
        ...data,
    };

    const certificate = await Certificate.create(certificateData);
    return certificate;
};
const getCertificateById = async(id : string): Promise<ICertificate | null> => {
    try {
        
        const certificate = await Certificate.findOne({ certificateId: id });
        console.log(certificate)
        return certificate
    } catch (error) {
        console.error('Error fetching certificate:', error);
        throw new Error('Certificate not found')
    }
}

const updateCertificate = async (id: string, data: Partial<ICertificate>): Promise<ICertificate | null> => {
    const certificate = await getCertificateById(id);
    if (!certificate) {
        throw new Error('Certificate not found');
    }
    return Certificate.findByIdAndUpdate(certificate?._id, data, { new: true });
};

const deleteCertificate = async (id: string): Promise<Boolean> => {
    try {
        const certificate = await getCertificateById(id);
        if (!certificate) {
            throw new Error('Certificate not found');
        }

        await Certificate.findByIdAndDelete(certificate._id);

        const pdfUrl = certificate.s3Url;

        const pdfKey = extractPath(pdfUrl);
        console.log(pdfKey)

        await deleteCertificatePdf(pdfKey);
        return true

    } catch (error) {
        return false
    }
};

const getAllCertificates = async (): Promise<ICertificate[]> => {
    try {
        const certificates = await Certificate.find();
        return certificates;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw new Error('Error fetching certificates');
    }
};


export { getCertificateById, updateCertificate, deleteCertificate, createCertificate, getAllCertificates }