const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./db'); // Assuming connectDB is set up to handle MongoDB connection

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().then(() => {
    // View engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // Security and performance middlewares
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(compression());

    // Session setup
    app.use(session({
        secret: process.env.SESSION_SECRET || 'yourSecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    }));

    // Parsing middlewares
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());

    // Static files
    app.use(express.static(path.join(__dirname, 'public'), {
        etag: true,
        lastModified: true,
        cacheControl: true,
        setHeaders: (res, path) => {
            if (process.env.NODE_ENV === 'production') {
                res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
            } else {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            }
        }
    }));

    // Custom logging middleware (optional)
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // Routes
    app.use(routes);

    // Global error handler
    app.use((err, req, res, next) => {
        console.error("❌ Server Error:", err.stack);
        res.status(500).render('500', { message: 'Internal Server Error' });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });

}).catch(err => {
    console.error("❌ Failed to connect to MongoDB", err);
});
