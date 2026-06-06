const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, brandName } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const existingBrand = await prisma.brand.findUnique({ where: { email } });
        if (existingBrand) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const brand = await prisma.brand.create({
            data: {
                email,
                password: hashedPassword,
                brandName: brandName || ''
            }
        });

        const token = jwt.sign({ brandId: brand.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, brandId: brand.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const brand = await prisma.brand.findUnique({ where: { email } });
        if (!brand) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, brand.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ brandId: brand.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, brandId: brand.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
