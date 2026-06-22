const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const cheerio = require('cheerio');

router.put('/:id', async (req, res) => {
    try {
        const brandId = req.params.id;
        const {
            brandName, category, website, product, usp,
            audience, audiencePainPoints, audienceInterests,
            campaignObjective, tone, theme, linkedInConnected, logoUrl
        } = req.body;

        let websiteScrapedData = '';

        if (website) {
            try {
                // Ensure URL has http/https protocol
                const url = website.startsWith('http') ? website : `https://${website}`;
                const scraperApiKey = 'b21f92d16cfc64e1fbcdf3356bf62db0';
                const scraperUrl = `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`;
                
                const response = await fetch(scraperUrl);
                const html = await response.text();
                const $ = cheerio.load(html);
                
                // Remove scripts and styles
                $('script, style').remove();
                
                // Get title, meta description, and body text (limited)
                const title = $('title').text();
                const metaDesc = $('meta[name="description"]').attr('content') || '';
                const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000); // 5000 chars limit
                
                websiteScrapedData = `Title: ${title}\nDescription: ${metaDesc}\nContent: ${bodyText}`;
            } catch (err) {
                console.warn(`Failed to scrape website ${website}:`, err.message);
                websiteScrapedData = 'Failed to scrape website.';
            }
        }

        const updateData = {
            brandName,
            category,
            website,
            product,
            usp,
            audience,
            audiencePainPoints,
            audienceInterests,
            campaignObjective,
            theme: theme || 'dark',
        };

        if (tone) {
            updateData.toneFormal = tone.formal ?? 50;
            updateData.toneSerious = tone.serious ?? 50;
            updateData.toneMinimal = tone.minimal ?? 50;
        }
        if (websiteScrapedData) updateData.websiteScrapedData = websiteScrapedData;
        if (typeof req.body.linkedinPersonalConnected === 'boolean') updateData.linkedinPersonalConnected = req.body.linkedinPersonalConnected;
        if (typeof req.body.linkedinCompanyConnected === 'boolean') updateData.linkedinCompanyConnected = req.body.linkedinCompanyConnected;
        if (logoUrl !== undefined) updateData.logoUrl = logoUrl;

        const brand = await prisma.brand.update({
            where: { id: brandId },
            data: updateData
        });

        res.json({ success: true, brand });
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: req.params.id },
            include: { images: true }
        });
        if (!brand) return res.status(404).json({ success: false, error: 'Brand not found' });
        res.json({ success: true, brand });
    } catch (error) {
        console.error('Error fetching brand:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
