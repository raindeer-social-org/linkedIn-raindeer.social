const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
const brandRoutes = require('./routes/brand');
const uploadRoutes = require('./routes/upload');
const generateRoutes = require('./routes/generate');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const linkedinRoutes = require('./routes/linkedin');

app.use('/api/auth', authRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/linkedin', linkedinRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Raindeer backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
