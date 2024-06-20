const mongoose = require('mongoose');

// Define the mongoDB connection URL
const mongoURL = "mongodb://localhost:27017";

// set up MongoDB connection
mongoose.connect(mongoURL, {
    // useNewUrlparser: true,
    // useUnifiedTopology: true,
})


// get the default connection
// mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;


// define event listeners for database connection
db.on('connected', () => {
    console.log("Connected to MongoDB server");
});

db.on('error', (error) => {
    console.log("MongoDB connection error", error);
});

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

// Export the database connection
module.exports = db;