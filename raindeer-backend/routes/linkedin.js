const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

const PERSONAL_CLIENT_ID = process.env.LINKEDIN_PERSONAL_CLIENT_ID;
const PERSONAL_CLIENT_SECRET = process.env.LINKEDIN_PERSONAL_CLIENT_SECRET;
const PERSONAL_REDIRECT_URI = process.env.LINKEDIN_PERSONAL_REDIRECT_URI;

const COMPANY_CLIENT_ID = process.env.LINKEDIN_COMPANY_CLIENT_ID;
const COMPANY_CLIENT_SECRET = process.env.LINKEDIN_COMPANY_CLIENT_SECRET;
const COMPANY_REDIRECT_URI = process.env.LINKEDIN_COMPANY_REDIRECT_URI;

// Initiate Personal OAuth flow
router.get('/auth/personal', (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).send('brandId required');

    // Scopes needed for personal: w_member_social (to post), openid profile email (to get user info via OpenID Connect)
    const scopes = encodeURIComponent('w_member_social openid profile email');
    const state = brandId;
    
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${PERSONAL_CLIENT_ID}&redirect_uri=${encodeURIComponent(PERSONAL_REDIRECT_URI)}&state=${state}&scope=${scopes}`;
    
    res.redirect(linkedInAuthUrl);
});

// Initiate Company OAuth flow
router.get('/auth/company', (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).send('brandId required');

    // Scopes needed for company pages: w_organization_social, rw_organization_admin (or r_organization_social) + r_basicprofile to identify member
    const scopes = encodeURIComponent('w_organization_social rw_organization_admin r_organization_social r_basicprofile');
    const state = brandId;
    
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${COMPANY_CLIENT_ID}&redirect_uri=${encodeURIComponent(COMPANY_REDIRECT_URI)}&state=${state}&scope=${scopes}`;
    
    res.redirect(linkedInAuthUrl);
});

async function handleOAuthCallback(req, res, isPersonal) {
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
        const client_id = isPersonal ? PERSONAL_CLIENT_ID : COMPANY_CLIENT_ID;
        const client_secret = isPersonal ? PERSONAL_CLIENT_SECRET : COMPANY_CLIENT_SECRET;
        const redirect_uri = isPersonal ? PERSONAL_REDIRECT_URI : COMPANY_REDIRECT_URI;

        // Exchange code for access token
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            client_id,
            client_secret
        });

        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString()
        });
        
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) {
            throw new Error(tokenData.error_description || 'Failed to fetch access token');
        }

        const accessToken = tokenData.access_token;
        const idToken = tokenData.id_token;
        
        let personId = null;
        if (idToken) {
            const base64Payload = idToken.split('.')[1];
            const payloadBuffer = Buffer.from(base64Payload, 'base64');
            const userData = JSON.parse(payloadBuffer.toString('utf8'));
            personId = userData.sub;
        } else {
            // Fallback for Community Management API using r_basicprofile instead of OpenID
            const profileRes = await fetch('https://api.linkedin.com/v2/me', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                personId = profileData.id;
            } else {
                const errorData = await profileRes.json();
                console.error('LinkedIn /v2/me Fetch Error:', errorData);
            }
        }

        const updateData = isPersonal ? {
            linkedinPersonalToken: accessToken,
            linkedinPersonalConnected: true,
            ...(personId && { linkedinPersonId: personId })
        } : {
            linkedinCompanyToken: accessToken,
            linkedinCompanyConnected: true,
            ...(personId && { linkedinPersonId: personId }) // Usually person ID is same
        };

        await prisma.brand.update({
            where: { id: brandId },
            data: updateData
        });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?linkedin=${isPersonal ? 'personal' : 'company'}`);

    } catch (err) {
        console.error('LinkedIn Callback Error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?error=${encodeURIComponent(err.message)}`);
    }
}

// Personal OAuth Callback
router.get('/callback/personal', (req, res) => handleOAuthCallback(req, res, true));

// Company OAuth Callback
router.get('/callback/company', (req, res) => handleOAuthCallback(req, res, false));

// Existing generic callback for backwards compatibility just in case
router.get('/callback', (req, res) => handleOAuthCallback(req, res, true));

router.get('/posts/:brandId', async (req, res) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: req.params.brandId }
        });

        // Use either token depending on what's available
        const token = brand?.linkedinPersonalToken || brand?.linkedinCompanyToken;

        if (!brand || !token || !brand.linkedinPersonId) {
            return res.status(400).json({ success: false, error: 'Not connected to LinkedIn' });
        }

        const authorUrn = encodeURIComponent(`urn:li:person:${brand.linkedinPersonId}`);
        const liRes = await fetch(`https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${authorUrn})&count=10`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const liData = await liRes.json();

        if (!liRes.ok && liRes.status === 403) {
            console.log('LinkedIn API 403: Falling back to local published posts due to missing read scopes.');
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
        }

        if (!liRes.ok) {
            throw new Error(`LinkedIn API Error: ${liData.message || JSON.stringify(liData)}`);
        }

        res.json({ success: true, posts: liData.elements || [] });
    } catch (err) {
        console.error('LinkedIn Fetch Posts Error:', err);
        
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

router.get('/organizations/:brandId', async (req, res) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: req.params.brandId }
        });

        if (!brand || !brand.linkedinCompanyToken) {
            return res.status(400).json({ success: false, error: 'Not connected to LinkedIn Company pages' });
        }

        const orgRes = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED', {
            headers: {
                'Authorization': `Bearer ${brand.linkedinCompanyToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const orgData = await orgRes.json();

        if (!orgRes.ok) {
            console.error('LinkedIn Org Fetch Error:', orgData);
            return res.status(orgRes.status).json({ success: false, error: orgData.message || 'Failed to fetch organizations', details: orgData });
        }

        const elements = orgData.elements || [];
        if (elements.length === 0) {
            return res.json({ success: true, organizations: [] });
        }

        const orgUrns = elements.map(el => el.organizationalTarget);
        const orgIds = orgUrns.map(urn => urn.split(':').pop());
        
        const detailsRes = await fetch(`https://api.linkedin.com/v2/organizations?ids=List(${orgIds.join(',')})`, {
            headers: {
                'Authorization': `Bearer ${brand.linkedinCompanyToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });
        
        const detailsData = await detailsRes.json();
        const organizations = [];
        
        if (detailsRes.ok && detailsData.results) {
            for (const id of orgIds) {
                if (detailsData.results[id]) {
                    organizations.push({
                        urn: `urn:li:organization:${id}`,
                        name: detailsData.results[id].localizedName || 'Unknown Organization',
                        id: id
                    });
                }
            }
        }
        res.json({ success: true, organizations });

    } catch (err) {
        console.error('Fetch Organizations Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
