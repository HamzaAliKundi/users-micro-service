import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import connectDB from './config/db';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));
  

app.get('/ping', (req, res) => {
    res.json({ status: 'ok', message: 'Users Service OK' });
});

app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`User service listning on port: ${PORT}`);
});