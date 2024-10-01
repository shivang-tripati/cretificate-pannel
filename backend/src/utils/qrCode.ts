import QRCode from 'qrcode';

export const generateQRCode = async (url: string): Promise<string> => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(url); // Generate a QR code as a data URL
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Error generating QR code');
  }
};
