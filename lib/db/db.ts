import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_PROFIT_RADAR_URI = process.env.MONGODB_PROFIT_RADAR_URI;

let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
	if (cachedConnection && mongoose.connection.readyState === 1) return cachedConnection;
	const uri = MONGODB_PROFIT_RADAR_URI;
	if (!uri) {
		throw new Error('MONGODB_PROFIT_RADAR_URI environment variable is not defined');
	}
	cachedConnection = await mongoose.connect(uri, {
		dbName: process.env.MONGODB_DB || 'profit_radar',
	});
	return cachedConnection;
}
