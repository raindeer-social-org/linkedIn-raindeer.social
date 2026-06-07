const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// Initiate OAuth flow
router.get('/auth', (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).send('brandId required');

    // Scopes needed: w_member_social (to post), openid profile email (to get user info via OpenID Connect)
    const scopes = encodeURIComponent('w_member_social openid profile email');
    
    // We pass brandId in the state parameter so we know which brand to update on callback
    const state = brandId;
    
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${scopes}`;
    
    res.redirect(linkedInAuthUrl);
});

// OAuth Callback
router.get('/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;
    const brandId = state;

    if (error) {
        console.error('LinkedIn Auth Error:', error, error_description);
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?error=${encodeURIComponent(error_description)}`);
    }

    if (!code || !brandId) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?error=InvalidRequest`);
    }

    try {
        // Exchange code for access token
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        });

        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString()
        });
        
        const tokenData = await tokenRes.json();
        console.log('LinkedIn Token Response:', tokenData);
        
        if (!tokenRes.ok) {
            throw new Error(tokenData.error_description || 'Failed to fetch access token');
        }

        const accessToken = tokenData.access_token;

        // The OpenID id_token contains the user info directly! No need to make an extra API call.
        const idToken = tokenData.id_token;
        if (!idToken) {
            throw new Error('No id_token returned from LinkedIn');
        }

        // Decode the JWT payload (the second part of the token)
        const base64Payload = idToken.split('.')[1];
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const userData = JSON.parse(payloadBuffer.toString('utf8'));

        console.log('Decoded ID Token:', userData);

        // The OpenID id_token payload contains 'sub' which is the person URN or ID
        const personId = userData.sub;

        // Update brand in DB
        await prisma.brand.update({
            where: { id: brandId },
            data: {
                linkedinAccessToken: accessToken,
                linkedinPersonId: personId,
                linkedInConnected: true
            }
        });

        // Redirect back to frontend
        res.redirect('${process.env.FRONTEND_URL}/dashboard/settings?linkedin=success');

    } catch (err) {
        console.error('LinkedIn Callback Error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?error=${encodeURIComponent(err.message)}`);
    }
});

router.get('/posts/:brandId', async (req, res) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: req.params.brandId }
        });

        if (!brand || !brand.linkedinAccessToken || !brand.linkedinPersonId) {
            return res.status(400).json({ success: false, error: 'Not connected to LinkedIn' });
        }

        const authorUrn = encodeURIComponent(`urn:li:person:${brand.linkedinPersonId}`);
        const liRes = await fetch(`https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${authorUrn})&count=10`, {
            headers: {
                'Authorization': `Bearer ${brand.linkedinAccessToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const liData = await liRes.json();

        // If LinkedIn throws a 403 due to missing r_member_social scope (very common), fallback to our local DB
        if (!liRes.ok && liRes.status === 403) {
            console.log('LinkedIn API 403: Falling back to local published posts due to missing read scopes.');
            const localPosts = await prisma.post.findMany({
                where: { brandId: req.params.brandId, status: 'PUBLISHED' },
                include: { image: true },
                orderBy: { date: 'desc' }
            });
            // Map local posts to LinkedIn format so the frontend doesn't break
            const fallbackPosts = localPosts.map(p => ({
                id: p.id,
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text: p.content }
                    }
                }
            }));
            return res.json({ success: true, posts: fallbackPosts, fallback: true });
        }

        if (!liRes.ok) {
            throw new Error(`LinkedIn API Error: ${liData.message || JSON.stringify(liData)}`);
        }

        res.json({ success: true, posts: liData.elements || [] });
    } catch (err) {
        console.error('LinkedIn Fetch Posts Error:', err);
        
        // Final fallback just in case
        try {
            const localPosts = await prisma.post.findMany({
                where: { brandId: req.params.brandId, status: 'PUBLISHED' },
                include: { image: true },
                orderBy: { date: 'desc' }
            });
            const fallbackPosts = localPosts.map(p => ({
                id: p.id,
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text: p.content }
                    }
                }
            }));
            return res.json({ success: true, posts: fallbackPosts, fallback: true });
        } catch (dbErr) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
});

module.exports = router;
