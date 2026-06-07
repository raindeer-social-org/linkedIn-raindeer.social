const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid token' });
        }
        req.brandId = decoded.brandId;
        next();
    });
};

// Get all posts for the authenticated brand
router.get('/', authenticateToken, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { brandId: req.brandId },
            include: { image: true },
            orderBy: { date: 'asc' }
        });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reschedule a post
router.patch('/:id/reschedule', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, scheduledTime } = req.body;
        
        if (!date) {
            return res.status(400).json({ success: false, error: 'Date is required' });
        }

        const existingPost = await prisma.post.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        if (existingPost.brandId !== req.brandId) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                date: new Date(date),
                scheduledTime: scheduledTime || null
            },
            include: { image: true }
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error rescheduling post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all posts for a brand
router.get('/brand/:brandId', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { brandId: req.params.brandId },
            include: { image: true },
            orderBy: { date: 'asc' }
        });
        res.json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update post (e.g. edit content, push/publish)
router.put('/:id', async (req, res) => {
    try {
        const { content, status } = req.body;
        
        // First get the existing post
        const existingPost = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: { brand: true, image: true }
        });

        if (!existingPost) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const updateData = {};
        if (content !== undefined) updateData.content = content;
        if (status !== undefined) updateData.status = status;

        // If pushing to published, trigger LinkedIn API
        if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
            const { linkedinAccessToken, linkedinPersonId } = existingPost.brand;
            
            if (!linkedinAccessToken || !linkedinPersonId) {
                return res.status(400).json({ success: false, error: 'Brand is not connected to LinkedIn' });
            }

            const postContent = content !== undefined ? content : existingPost.content;

            let shareMediaCategory = 'NONE';
            let mediaElements = [];

            if (existingPost.image && existingPost.image.url) {
                // 1. Register Upload
                const registerBody = {
                    registerUploadRequest: {
                        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                        owner: `urn:li:person:${linkedinPersonId}`,
                        serviceRelationships: [{
                            relationshipType: "OWNER",
                            identifier: "urn:li:userGeneratedContent"
                        }]
                    }
                };

                const regRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${linkedinAccessToken}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0'
                    },
                    body: JSON.stringify(registerBody)
                });

                const regData = await regRes.json();
                if (!regRes.ok) {
                    throw new Error(`LinkedIn Register Upload Error: ${regData.message || JSON.stringify(regData)}`);
                }

                const assetUrn = regData.value.asset;
                const uploadUrl = regData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;

                // 2. Fetch the image from our ImageKit URL
                const imgRes = await fetch(existingPost.image.url);
                if (!imgRes.ok) throw new Error('Failed to fetch image from ImageKit');
                const imgBuffer = await imgRes.arrayBuffer();

                // 3. Upload binary image to LinkedIn
                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${linkedinAccessToken}`,
                        'Content-Type': 'application/octet-stream'
                    },
                    body: imgBuffer
                });

                if (!uploadRes.ok) {
                    throw new Error(`LinkedIn Image Upload Failed with status: ${uploadRes.status}`);
                }

                // 4. Update post body payload
                shareMediaCategory = 'IMAGE';
                mediaElements = [{
                    status: 'READY',
                    media: assetUrn
                }];
            }

            const linkedInBody = {
                author: `urn:li:person:${linkedinPersonId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: postContent
                        },
                        shareMediaCategory: shareMediaCategory
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };

            if (shareMediaCategory === 'IMAGE') {
                linkedInBody.specificContent['com.linkedin.ugc.ShareContent'].media = mediaElements;
            }

            const liRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${linkedinAccessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                },
                body: JSON.stringify(linkedInBody)
            });

            const liData = await liRes.json();

            if (!liRes.ok) {
                throw new Error(`LinkedIn API Error: ${liData.message || JSON.stringify(liData)}`);
            }
        }

        const post = await prisma.post.update({
            where: { id: req.params.id },
            data: updateData,
            include: { image: true }
        });

        res.json({ success: true, post });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const multer = require('multer');
const upload = multer();

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        await prisma.post.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Direct Publish PDF Carousel to LinkedIn
router.post('/carousel-publish/:brandId', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No PDF document provided' });
        }

        const brand = await prisma.brand.findUnique({ where: { id: req.params.brandId } });
        if (!brand || !brand.linkedinAccessToken || !brand.linkedinPersonId) {
            return res.status(400).json({ success: false, error: 'Not connected to LinkedIn' });
        }

        const title = req.body.title || 'LinkedIn Carousel';

        // 1. Register Document Upload
        const registerBody = {
            registerUploadRequest: {
                recipes: ["urn:li:digitalmediaRecipe:feedshare-document"],
                owner: `urn:li:person:${brand.linkedinPersonId}`,
                serviceRelationships: [{
                    relationshipType: "OWNER",
                    identifier: "urn:li:userGeneratedContent"
                }]
            }
        };

        const regRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${brand.linkedinAccessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(registerBody)
        });

        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`LinkedIn Register Error: ${JSON.stringify(regData)}`);

        const assetUrn = regData.value.asset;
        const uploadUrl = regData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;

        // 2. Upload the PDF Binary Buffer to LinkedIn
        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${brand.linkedinAccessToken}`,
                'Content-Type': 'application/pdf'
            },
            body: req.file.buffer
        });

        if (!uploadRes.ok) throw new Error(`LinkedIn Document Upload Failed: ${uploadRes.status}`);

        // 3. Publish the Document Post
        const linkedInBody = {
            author: `urn:li:person:${brand.linkedinPersonId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: `Check out my latest carousel on ${title}! 🚀`
                    },
                    shareMediaCategory: 'DOCUMENT',
                    media: [{
                        status: 'READY',
                        media: assetUrn,
                        title: title
                    }]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const liRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${brand.linkedinAccessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(linkedInBody)
        });

        const liData = await liRes.json();
        if (!liRes.ok) throw new Error(`LinkedIn Publish Error: ${JSON.stringify(liData)}`);

        // Log the published post in our DB
        await prisma.post.create({
            data: {
                brandId: brand.id,
                content: `Published Carousel: ${title}`,
                date: new Date(),
                status: 'PUBLISHED',
                type: 'Carousel'
            }
        });

        res.json({ success: true, post: liData });

    } catch (error) {
        console.error('LinkedIn Carousel Publish Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
