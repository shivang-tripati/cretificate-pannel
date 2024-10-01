import multer from 'multer';

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory for uploading to S3
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDFs are allowed')); // Pass the error object as the first argument
        }
        cb(null, true); // Pass null as the first argument, and the result as the second argument
    }
});

export default upload;
