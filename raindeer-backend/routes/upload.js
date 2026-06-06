const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const prisma = require('../lib/prisma');

const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

router.post('/logo', upload.single('image'), async (req, res) => {
    try {
        const { brandId } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ success: false, error: 'No image provided' });
        if (!brandId) return res.status(400).json({ success: false, error: 'No brandId provided' });

        // Upload directly to ImageKit
        const uploadResponse = await new Promise((resolve, reject) => {
            imagekit.upload({
                file: file.buffer,
                fileName: file.originalname || 'logo.png',
                folder: `/raindeer/${brandId}/logo`
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        // Do not save to the Image table, just return URL
        res.status(201).json({ success: true, url: uploadResponse.url });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { brandId, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }
        if (!brandId) {
            return res.status(400).json({ success: false, error: 'No brandId provided' });
        }

        // Upload to ImageKit
        const uploadResponse = await new Promise((resolve, reject) => {
            imagekit.upload({
                file: file.buffer,
                fileName: file.originalname || 'image.jpg',
                folder: `/raindeer/${brandId}`
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        // Save to Database
        const imageRecord = await prisma.image.create({
            data: {
                brandId,
                url: uploadResponse.url,
                imagekitId: uploadResponse.fileId,
                description: description || ''
            }
        });

        res.status(201).json({ success: true, image: imageRecord });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// For fetching images for a brand
router.get('/brand/:brandId', async (req, res) => {
    try {
        const images = await prisma.image.findMany({
            where: { brandId: req.params.brandId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, images });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
