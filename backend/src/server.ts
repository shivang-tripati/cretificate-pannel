import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, { Express } from 'express';
import connectDB from './config/db';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import certificateRoutes from './routes/certificateRoutes';
import errorHandler from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';

dotenv.config();

// Create Express app
const app: Express = express();

// Swagger configuration
const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sample API',
            version: '1.0.0',
            description: 'Sample API documentation',
        },
        servers: [
            {
                url: 'https://cretificate-pannel-production.up.railway.app/',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Adjust paths as needed
};

// Generate Swagger specification
const swaggerSpec = swaggerJsDoc(options);

// Set up Swagger UI
const setUpSwagger = (app: Express) => {
    console.log('Setting up Swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

// Call the function to set up Swagger
setUpSwagger(app);

// Connect to Database
connectDB();



// Handle preflight requests explicitly
app.options('*', cors({
  origin: [ 'https://cretificate-pannel.vercel.app/' , 'http://localhost:3000' ],
  credentials: true
}));

// Enable CORS
app.use('*' ,cors({
    origin: [ 'https://cretificate-pannel.vercel.app/' , 'http://localhost:3000' ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

// Middleware
app.use(morgan('dev')); // Logging
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-encoded data

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000....');
});
