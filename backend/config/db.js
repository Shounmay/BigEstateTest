import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connection = () => {
	mongoose.set('strictQuery', false);
	mongoose
		.connect(process.env.MONGODB_URI)
		.then(() => console.log('DB connected'))
		.catch((err) => console.log('error: ', err));
};
