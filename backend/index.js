import express from 'express';
import { connection } from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 6000;

app.use(express.json());
dotenv.config();

// Initialize Connection
connection();

app.get('/health', (req, res) => {
	res.status(200).json({
		'server status': `running on PORT ${PORT} at ${new Date()}`,
	});
});

app.use(`${process.env.API_VERSION}/auth`, authRoutes);

app.use((_req, res, _next) => {
	res.status(404).send('404 - Not Found');
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
