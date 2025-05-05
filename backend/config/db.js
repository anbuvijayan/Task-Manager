const mongoose = require('mongoose');

let retryAttempts = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('🚫 MONGODB_URI is not defined in the environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ MongoDB connected [${process.env.NODE_ENV || "development"}]`);
        retryAttempts = 0;

        // Optional helpful events
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        mongoose.connection.on('error', err => {
            console.error('🔥 MongoDB error:', err);
        });

    } catch (error) {
        retryAttempts++;
        console.error(`❌ MongoDB connection failed (Attempt ${retryAttempts}): ${error.message}`);

        if (retryAttempts < MAX_RETRIES) {
            console.log('🔁 Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            console.error('🚫 Max retry attempts reached. Exiting...');
            process.exit(1);
        }
    }
};

module.exports = connectDB;
