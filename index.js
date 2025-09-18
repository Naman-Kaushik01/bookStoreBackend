import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // it is controlling the calls
import dotenv from 'dotenv';
import bookRoutes from './Routes/bookRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/books', bookRoutes); 
app.get('/', (req, res) => res.send('This is my backend of bookstore'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log('Server is running finee'));
  })
  .catch(err => console.log(err));
