const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

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

module.exports = router;
