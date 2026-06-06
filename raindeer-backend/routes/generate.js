const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_1 });

router.post('/', async (req, res) => {
    try {
        const { brandId, imageId, date } = req.body;
        
        if (!brandId) return res.status(400).json({ success: false, error: 'brandId required' });

        const brand = await prisma.brand.findUnique({ where: { id: brandId } });
        if (!brand) return res.status(404).json({ success: false, error: 'Brand not found' });

        let imageContext = '';
        let imageToUse = null;

        if (imageId) {
            imageToUse = await prisma.image.findUnique({ where: { id: imageId } });
            if (imageToUse) {
                imageContext = `The post will include an image described as: "${imageToUse.description}". Image URL: ${imageToUse.url}. Make sure the post caption matches or refers to this image naturally.`;
            }
        }

        const prompt = `
You are an expert social media manager specializing in LinkedIn.
Please write a highly engaging, professional yet authentic LinkedIn post for the following brand:

Brand Name: ${brand.brandName}
Product/Service: ${brand.product || 'N/A'}
Unique Selling Point: ${brand.usp || 'N/A'}
Target Audience: ${brand.audience || 'N/A'}
Audience Pain Points: ${brand.audiencePainPoints || 'N/A'}
Campaign Objective: ${brand.campaignObjective || 'Awareness'}

Context from their website:
${brand.websiteScrapedData ? brand.websiteScrapedData.slice(0, 2000) : 'N/A'}

Tone of Voice:
Formal: ${brand.toneFormal}/100 (0=Casual, 100=Formal)
Serious: ${brand.toneSerious}/100 (0=Playful, 100=Serious)
Minimal: ${brand.toneMinimal}/100 (0=Bold, 100=Minimal)

${imageContext}

Requirements:
- The post should be optimized for LinkedIn (use spacing, engaging hook, valuable body, clear call to action).
- Include 3-5 relevant hashtags at the end.
- Output ONLY the post content, no extra commentary or markdown code blocks around the text.
- Do NOT output "Here is your post:".
        `.trim();

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const postContent = chatCompletion.choices[0]?.message?.content || '';

        // Save as a draft post
        const post = await prisma.post.create({
            data: {
                brandId,
                imageId: imageToUse?.id || null,
                content: postContent,
                date: new Date(date || new Date()),
                status: 'SCHEDULED',
                type: 'LinkedIn Post'
            },
            include: { image: true }
        });

        res.json({ success: true, post });

    } catch (error) {
        console.error('Error generating post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/edit', async (req, res) => {
    try {
        const { content, instruction } = req.body;
        
        if (!content || !instruction) return res.status(400).json({ success: false, error: 'Content and instruction required' });

        const prompt = `
You are an expert social media manager specializing in LinkedIn.
Please rewrite the following LinkedIn post according to this instruction: "${instruction}"

Original Post:
"""
${content}
"""

Requirements:
- Only output the new rewritten post content.
- Do not add any introductory or concluding remarks.
- Keep relevant hashtags.
        `.trim();

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const newContent = chatCompletion.choices[0]?.message?.content || '';

        res.json({ success: true, content: newContent });

    } catch (error) {
        console.error('Error editing post with AI:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
