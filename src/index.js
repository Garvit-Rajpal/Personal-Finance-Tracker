const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

const PORT = config.PORT;

let server;

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('✓ Connected to MongoDB');
        server = app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ Environment: ${config.NODE_ENV}`);
        });
    })
    .catch((err) => {
        console.error('✗ MongoDB connection error:', err);
        process.exit(1);
    });

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if (server) {
        server.close(() => {
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    } else {
        process.exit(0);
    }
});
