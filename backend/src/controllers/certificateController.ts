import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import  { ICertificate } from '../models/certificateModel'
import { uploadCertificatePdf, deleteCertificatePdf } from '../services/s3Service'; // S3 service functions
import { generateQRCode } from '../utils/qrCode';
import{ getCertificateById, updateCertificate, deleteCertificate, createCertificate, getAllCertificates } from '../services/certificateService';
import { PDFDocument, rgb } from 'pdf-lib';

require('dotenv').config();

const AWS_REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME
const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL
console.log("FRONTEND_APP_URL", FRONTEND_APP_URL, "BUCKET_NAME", BUCKET_NAME, "AWS_REGION", AWS_REGION);

// Create certificate controller   
const create = async (req: Request, res: Response, next: NextFunction) => {

  const certificateId = uuidv4();
    
    try {
      // 1. Get file and other data from formData
      const { certificateName, status, userId } = req.body; 
      const file = req.file; // Assuming file is being uploaded via multer
      
      if (!file || !certificateName || !status) {
        return res.status(400).json({ message: 'Incomplete form data' });
      }

      //2. qrcode generation
      const verficationLink = `${process.env.FRONTEND_APP_URL}/verify/${certificateId}`; // Construct verification URL
      const qrCodeUrl = await generateQRCode(verficationLink);
      // console.log("qrCodeUrl in certificate controller", qrCodeUrl);

      // 3. proceesed pdf (i.e attach qrcode to pdf)
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const qrCodeImage = await pdfDoc.embedPng(qrCodeUrl);
      const { width, height } = qrCodeImage.size();
      firstPage.drawImage(qrCodeImage, {
        x: firstPage.getWidth() - width - 50, // Adjust position as needed
        y:  firstPage.getHeight() - height - 50,
        width: 100, // Adjust size as needed
        height: 100,
      });
      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes);

      // 4. Upload file to S3
      const s3FilePath = await uploadCertificatePdf(pdfBuffer, certificateName, userId, certificateId);
      const fileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3FilePath}`;
   
  
      // 4. Create certificate object
      const certificateData = {
        certificateId: certificateId,
        title: certificateName,
        description: req.body.description || "", // Optional description
        date: new Date(), // You can modify to use user-supplied date
        qrCodeUrl,
        s3Url: fileUrl,
        status: status,
        createdBy: userId,
        updatedBy: [{
          userId: userId,
          updatedAt: new Date(),
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      // 5. Save to database
      const certificate = await createCertificate(certificateData);
  
      // 6. Return response
      res.status(201).json({ message: 'Certificate created successfully', certificate });
    } catch (error) {
      console.error('Error creating certificate:', error);
      next(error);
    }
  };

  const getOne = async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.params.id in certificate controller", req.params.id);
    try {
      const data : ICertificate | null = await getCertificateById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Certificate not found' });
      const certificateData  = {
        certificateId: data?.certificateId,
        title: data?.title,
        s3Url: data?.s3Url, // Assuming qrCodeUrl is stored in S3 or is equivalent
        qrCodeUrl: data?.qrCodeUrl,
        status: data?.status, // Set to true if this certificate is active (or based on your logic)
        issuedDate: data?.date, // Or createdAt, depending on your preference
        issuedBy: data?.createdBy
      };
       
      res.status(200).json({ certificateData });
    } catch (error) {
      next(error);
    }
  };

// Get all certificates
const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificates: ICertificate[] = await getAllCertificates();
    res.status(200).json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Failed to retrieve certificates' });
  }
};

// Update a certificate
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificateId = req.params.id;
    const existingCertificate = await getCertificateById(certificateId);

    if (!existingCertificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    // @ts-ignore
    const user = req?.user;
    // Ensure updatedBy is an array of objects, and push the new update info
    const updatedData = {
      ...req.body,
      updatedBy: [
        ...existingCertificate.updatedBy, // Preserve existing update history
        { userId: user?._id, updatedAt: new Date() } // Add the new update info
      ],
    };

    const certificate = await updateCertificate(certificateId, updatedData);

    res.status(200).json({ message: 'Certificate updated successfully', certificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ message: 'Failed to update certificate' });
  }
};


// Delete a certificate
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificateId = req.params.id;
    const certificate = await getCertificateById(certificateId);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    const pdfKey = extractCertificatePath(certificate.s3Url);
    pdfKey && await deleteCertificatePdf(pdfKey);
    const result = await deleteCertificate(certificateId);
    if (!result) {
      return res.status(404).json({ message: 'Certificate not found' });
    }  
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ message: 'Failed to delete certificate' });
  }
};


export { create, getAll, getOne, update, remove }; 

const extractCertificatePath = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Check if the pathname starts with '__certificates/' and return it
    if (pathname.startsWith('/__certificates/')) {
      return pathname.slice(1); // Remove the leading '/'
    } else {
      console.error('URL does not contain the expected certificate path');
      return null;
    }
  } catch (error) {
    console.error('Error extracting certificate path from URL:', error);
    return null;
  }
};