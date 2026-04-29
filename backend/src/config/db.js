// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // i use mongoose to connect to the uri defined in our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // If the database fails to connect, we stop the whole server process
        process.exit(1); 
    }
};

export default connectDB;