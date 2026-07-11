const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_1 });

router.post('/', async (req, res) => {
    try {
        const { brandId, imageId, date, customPrompt } = req.body;
        
        if (!brandId) return res.status(400).json({ success: false, error: 'brandId required' });

        const brand = await prisma.brand.findUnique({ where: { id: brandId } });
        if (!brand) return res.status(404).json({ success: false, error: 'Brand not found' });

        let imageContext = '';
        let imageToUse = null;

        if (req.body.imageIds && Array.isArray(req.body.imageIds) && req.body.imageIds.length > 0) {
            const imagesToUse = await prisma.image.findMany({ where: { id: { in: req.body.imageIds } } });
            if (imagesToUse.length > 0) {
                imageToUse = imagesToUse[0]; // Primary image for attachment
                const descriptions = imagesToUse.map(img => `- Description: "${img.description}" | URL: ${img.url}`).join('\n');
                imageContext = `The post will include the following images:\n${descriptions}\nMake sure the post caption matches or refers to these images naturally.`;
            }
        } else if (imageId) {
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
${customPrompt ? `\nUser's Custom Instructions for this post:\n"${customPrompt}"\nMake sure to incorporate these instructions prominently.` : ''}

Requirements:
- The post should be optimized for LinkedIn (use spacing, engaging hook, valuable body, clear call to action).
- Include 3-5 relevant hashtags at the end.
- Output MUST be a valid JSON object matching the exact structure below.
- Do NOT output any markdown code blocks around the JSON (e.g. \`\`\`json). Just raw JSON.
- Include a highly descriptive \`image_prompt\` for an AI image generator (like Midjourney or DALL-E) that perfectly matches the post content. Make it detailed, specifying style, lighting, and subjects.

### LinkedIn Virality Matrix Guidelines (CRITICAL):
1. **Hook Strength:** The first 2-3 lines must create an information gap or emotional response (Contrarian, Failure, Data Surprise, Transformation, or Mistake). Do NOT use generic statements.
2. **Audience Relevance:** Content MUST resonate with a specific audience, preferably addressing a specific pain-point.
3. **Emotional Activation:** Evoke Surprise, Curiosity, Aspiration, Validation, Fear, Anger, or Inspiration.
4. **Story Quality:** Structure as: Situation -> Problem -> Attempt -> Failure -> Lesson -> Outcome. 
5. **Knowledge Density:** Include actionable advice (Frameworks, Checklists, Templates, Step-by-step processes).
6. **Comment Potential:** End with a strong CTA that invites a specific answer (e.g., "Founders: What's one marketing channel that surprised you this year?").
7. **Share Potential:** Make it feel like an industry report, original research, or a highly valuable framework.

### Output JSON Format:
{
 "post_content": "The actual LinkedIn post text goes here",
 "image_prompt": "A highly detailed description of an image for this post...",
 "virality_score": 84,
 "authority_score": 91,
 "lead_generation_score": 88,
 "target_persona": "SME Founder",
 "content_type": "Case Study",
 "strengths": ["...", "..."],
 "weaknesses": ["...", "..."]
}
        `.trim();

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1500,
        });

        let rawOutput = chatCompletion.choices[0]?.message?.content || '';
        
        // Sometimes LLMs wrap JSON in markdown blocks despite instructions
        if (rawOutput.startsWith('\`\`\`json')) rawOutput = rawOutput.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        else if (rawOutput.startsWith('\`\`\`')) rawOutput = rawOutput.replace(/\`\`\`/g, '').trim();

        let postContent = '';
        let imagePrompt = null;
        let postAnalysis = null;
        try {
            let jsonStr = rawOutput;
            const firstBrace = rawOutput.indexOf('{');
            const lastBrace = rawOutput.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonStr = rawOutput.substring(firstBrace, lastBrace + 1);
            }
            
            try {
                const parsed = JSON.parse(jsonStr);
                postContent = parsed.post_content;
                imagePrompt = parsed.image_prompt;
                postAnalysis = {
                    virality_score: parsed.virality_score,
                    authority_score: parsed.authority_score,
                    lead_generation_score: parsed.lead_generation_score,
                    target_persona: parsed.target_persona,
                    content_type: parsed.content_type,
                    strengths: parsed.strengths || [],
                    weaknesses: parsed.weaknesses || []
                };
            } catch (parseError) {
                console.error('JSON.parse failed, attempting regex fallback:', parseError.message);
                const contentMatch = jsonStr.match(/"post_content"\s*:\s*"([\s\S]*?)"\s*,\s*"virality_score"/);
                if (contentMatch) {
                    postContent = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                } else {
                    postContent = rawOutput; // ultimate fallback
                }
                
                // Fallback analysis extraction for scores if JSON parsing failed
                const viralityMatch = jsonStr.match(/"virality_score"\s*:\s*(\d+)/);
                const authorityMatch = jsonStr.match(/"authority_score"\s*:\s*(\d+)/);
                const leadGenMatch = jsonStr.match(/"lead_generation_score"\s*:\s*(\d+)/);
                const personaMatch = jsonStr.match(/"target_persona"\s*:\s*"([^"]+)"/);
                const typeMatch = jsonStr.match(/"content_type"\s*:\s*"([^"]+)"/);
                
                if (viralityMatch) {
                    postAnalysis = {
                        virality_score: viralityMatch ? parseInt(viralityMatch[1]) : null,
                        authority_score: authorityMatch ? parseInt(authorityMatch[1]) : null,
                        lead_generation_score: leadGenMatch ? parseInt(leadGenMatch[1]) : null,
                        target_persona: personaMatch ? personaMatch[1] : 'Unknown',
                        content_type: typeMatch ? typeMatch[1] : 'Post',
                        strengths: [],
                        weaknesses: []
                    };
                }
            }
        } catch (e) {
            console.error('Failed to process LLM output:', e);
            postContent = rawOutput;
        }

        // Save as a draft post
        const post = await prisma.post.create({
            data: {
                brandId,
                imageId: imageToUse?.id || null,
                imagePrompt: imagePrompt || null,
                content: postContent,
                analysis: postAnalysis,
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

router.post('/carousel', async (req, res) => {
    try {
        const { messages, brandId, topic } = req.body;
        
        if (!brandId || (!messages && !topic)) return res.status(400).json({ success: false, error: 'Messages/Topic and brandId required' });

        const brand = await prisma.brand.findUnique({ where: { id: brandId } });

        const systemPrompt = `
You are an expert social media manager specializing in highly viral LinkedIn Carousels.
Your job is to generate and iteratively refine a 5-6 slide LinkedIn Carousel based on user instructions.

Brand Name: ${brand.brandName || 'N/A'}
Target Audience: ${brand.audience || 'N/A'}

### LinkedIn Virality Matrix Guidelines (CRITICAL):
1. **Hook Strength (Cover Slide):** The cover title MUST create an information gap or emotional response (Contrarian, Failure, Data Surprise, Transformation, or Mistake). Do NOT use generic statements like "5 tips for X". Instead use "We analyzed 1000 X. Here's what we found."
2. **Audience Relevance:** Content MUST resonate with the specific target audience's deepest pain points.
3. **Story Quality:** Content slides should follow: Situation -> Problem -> Attempt -> Failure -> Lesson -> Outcome.
4. **Knowledge Density:** Ensure every content slide is packed with actionable value (Frameworks, Checklists, Templates).
5. **Comment Potential (CTA Slide):** End with a strong Call-To-Action that invites a specific answer (e.g., "Founders: What's one marketing channel that surprised you this year?").

Output MUST be a valid JSON array of slide objects.
Do NOT output any conversational text or markdown code blocks. Just raw JSON.

JSON Array Format:
[
  { "type": "cover", "title": "Catchy Hook Title", "subtitle": "Supporting text" },
  { "type": "content", "title": "Main Point", "points": ["Detail 1", "Detail 2"] },
  { "type": "cta", "title": "Call to action title", "text": "Follow for more" }
]
        `.trim();

        // Support both old "topic" format and new "messages" format
        const chatMessages = messages || [{ role: 'user', content: `Please generate a carousel about: "${topic}"` }];

        const groqMessages = [
            { role: 'system', content: systemPrompt },
            ...chatMessages.map(m => ({
                role: m.role,
                content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
            }))
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: groqMessages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1500,
        });

        let rawOutput = chatCompletion.choices[0]?.message?.content || '';
        if (rawOutput.startsWith('\`\`\`json')) rawOutput = rawOutput.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        else if (rawOutput.startsWith('\`\`\`')) rawOutput = rawOutput.replace(/\`\`\`/g, '').trim();

        const slides = JSON.parse(rawOutput);
        res.json({ success: true, slides });

    } catch (error) {
        console.error('Error generating carousel:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/bulk', async (req, res) => {
    try {
        const { brandId, startDate, endDate, postsPerDay = 1, generationMode = 'prompt_only', customPrompt } = req.body;
        
        if (!brandId || !startDate || !endDate) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }

        const brand = await prisma.brand.findUnique({ where: { id: brandId } });
        if (!brand) return res.status(404).json({ success: false, error: 'Brand not found' });

        let availableImages = [];
        if (generationMode === 'use_photos') {
            availableImages = await prisma.image.findMany({ where: { brandId } });
            if (availableImages.length === 0) {
                return res.status(400).json({ success: false, error: 'No photos available for this brand.' });
            }
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        let currentDate = new Date(start);
        
        let generatedPostsCount = 0;
        let imageIndex = 0;

        // Loop through each day
        while (currentDate <= end) {
            for (let i = 0; i < postsPerDay; i++) {
                let imageId = null;
                if (generationMode === 'use_photos' && availableImages.length > 0) {
                    imageId = availableImages[imageIndex % availableImages.length].id;
                    imageIndex++;
                }

                // Call the existing logic essentially, but directly using Groq to avoid internal fetch
                let imageContext = '';
                let imageToUse = null;

                if (imageId) {
                    imageToUse = availableImages.find(img => img.id === imageId);
                    if (imageToUse) {
                        imageContext = `The post will include an image described as: "${imageToUse.description}". Image URL: ${imageToUse.url}. Make sure the post caption matches or refers to this image naturally.`;
                    }
                } else if (generationMode === 'prompt_only' || generationMode === 'text_only') {
                    imageContext = 'No specific image is provided. Please generate a highly creative image_prompt that fits the post context.';
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
${customPrompt ? `\nUser's Custom Instructions for this post:\n"${customPrompt}"\nMake sure to incorporate these instructions prominently.` : ''}

Requirements:
- The post should be optimized for LinkedIn (use spacing, engaging hook, valuable body, clear call to action).
- Include 3-5 relevant hashtags at the end.
- Output MUST be a valid JSON object matching the exact structure below.
- Do NOT output any markdown code blocks around the JSON (e.g. \`\`\`json). Just raw JSON.
- Include a highly descriptive \`image_prompt\` for an AI image generator (like Midjourney or DALL-E) that perfectly matches the post content. Make it detailed, specifying style, lighting, and subjects.

### LinkedIn Virality Matrix Guidelines (CRITICAL):
1. **Hook Strength:** The first 2-3 lines must create an information gap or emotional response (Contrarian, Failure, Data Surprise, Transformation, or Mistake). Do NOT use generic statements.
2. **Audience Relevance:** Content MUST resonate with a specific audience, preferably addressing a specific pain-point.
3. **Emotional Activation:** Evoke Surprise, Curiosity, Aspiration, Validation, Fear, Anger, or Inspiration.
4. **Story Quality:** Structure as: Situation -> Problem -> Attempt -> Failure -> Lesson -> Outcome. 
5. **Knowledge Density:** Include actionable advice (Frameworks, Checklists, Templates, Step-by-step processes).
6. **Comment Potential:** End with a strong CTA that invites a specific answer.
7. **Share Potential:** Make it feel like an industry report, original research, or a highly valuable framework.

### Output JSON Format:
{
 "post_content": "The actual LinkedIn post text goes here",
 "image_prompt": "A highly detailed description of an image for this post...",
 "virality_score": 84,
 "authority_score": 91,
 "lead_generation_score": 88,
 "target_persona": "SME Founder",
 "content_type": "Case Study",
 "strengths": ["...", "..."],
 "weaknesses": ["...", "..."]
}
                `.trim();

                const chatCompletion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.1-8b-instant',
                    temperature: 0.8, // Slightly higher for more variety in bulk
                    max_tokens: 1500,
                });

                let rawOutput = chatCompletion.choices[0]?.message?.content || '';
                if (rawOutput.startsWith('```json')) rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
                else if (rawOutput.startsWith('```')) rawOutput = rawOutput.replace(/```/g, '').trim();

                let postContent = '';
                let imagePrompt = null;
                let postAnalysis = null;
                
                try {
                    let jsonStr = rawOutput;
                    const firstBrace = rawOutput.indexOf('{');
                    const lastBrace = rawOutput.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                        jsonStr = rawOutput.substring(firstBrace, lastBrace + 1);
                    }
                    const parsed = JSON.parse(jsonStr);
                    postContent = parsed.post_content;
                    imagePrompt = parsed.image_prompt;
                    postAnalysis = {
                        virality_score: parsed.virality_score,
                        authority_score: parsed.authority_score,
                        lead_generation_score: parsed.lead_generation_score,
                        target_persona: parsed.target_persona,
                        content_type: parsed.content_type,
                        strengths: parsed.strengths || [],
                        weaknesses: parsed.weaknesses || []
                    };
                } catch (e) {
                    console.error('Failed to parse LLM output in bulk gen', e);
                    postContent = rawOutput;
                }

                // Assign a time (spread across the day if postsPerDay > 1)
                const scheduledHour = 9 + (i * Math.floor(8 / postsPerDay));
                const scheduledTime = `${scheduledHour.toString().padStart(2, '0')}:00`;

                await prisma.post.create({
                    data: {
                        brandId,
                        imageId: imageToUse?.id || null,
                        imagePrompt: imagePrompt || null,
                        content: postContent,
                        analysis: postAnalysis,
                        date: new Date(currentDate),
                        scheduledTime,
                        status: 'SCHEDULED',
                        type: 'LinkedIn Post'
                    }
                });
                
                generatedPostsCount++;
            }
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        res.json({ success: true, count: generatedPostsCount });

    } catch (error) {
        console.error('Error generating bulk posts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

