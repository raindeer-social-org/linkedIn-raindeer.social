const rawOutput = `{
  "post_content": "Are you tired of spending hours daily on social media marketing, only to see mediocre results? \n\nAt Raindeer Social, we understand the pain of small startups like you. That's why we're revolutionizing the game with our multi-AI agent technology, making it possible to generate high-quality content, track analytics, and measure ROI on a unified dashboard.\n\nOur clients, Hoblixx, Slay Health, and NST Delhi, have already seen remarkable results with our platform. They've experienced a significant reduction in their daily marketing hustle and a substantial increase in engagement.\n\nBut don't just take our word for it! Digital marketing is no longer a choice; it's a necessity for any business looking to thrive in today's competitive landscape. As seen in our graphic, the importance of digital marketing cannot be overstated.\n\nReady to transform your marketing strategy? Join our community of innovators and get early access to our AI marketing engine. \n\nFounders: What's one marketing channel that surprised you this year?",
  "virality_score": 84,
  "authority_score": 91,
  "lead_generation_score": 88,
  "target_persona": "SME Founder",
  "content_type": "Case Study",
  "strengths": ["Emotional Activation", "Story Quality", "Knowledge Density"],
  "weaknesses": ["Hook Strength"]
}

This post aims to create an information gap by sharing a common pain point faced by small startups and then offering a solution that can transform their marketing strategy. By highlighting the success of their clients and providing actionable advice, the post aims to evoke curiosity and aspiration in the target audience. The strong call-to-action at the end invites the audience to share their own marketing experiences, increasing the potential for comments and shares.`;

let jsonStr = rawOutput;
const firstBrace = rawOutput.indexOf('{');
const lastBrace = rawOutput.lastIndexOf('}');
if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonStr = rawOutput.substring(firstBrace, lastBrace + 1);
}

let postContent = '';
let postAnalysis = null;
try {
    const parsed = JSON.parse(jsonStr);
    postContent = parsed.post_content;
    postAnalysis = parsed;
} catch (e) {
    console.error("Parse failed, using regex fallback");
    const contentMatch = jsonStr.match(/"post_content"\s*:\s*"([\s\S]*?)"\s*,\s*"virality_score"/);
    if (contentMatch) {
        postContent = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else {
        postContent = rawOutput;
    }
}
console.log("Post Content:\n", postContent.substring(0, 50) + "...");
