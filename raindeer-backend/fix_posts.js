const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const posts = await prisma.post.findMany();
  for (const p of posts) {
    if (p.content.startsWith('{')) {
      try {
        const firstBrace = p.content.indexOf('{');
        const lastBrace = p.content.lastIndexOf('}');
        let jsonStr = p.content;
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonStr = p.content.substring(firstBrace, lastBrace + 1);
        }
        const parsed = JSON.parse(jsonStr);
        if (parsed.post_content) {
          await prisma.post.update({
            where: { id: p.id },
            data: { 
              content: parsed.post_content,
              analysis: {
                virality_score: parsed.virality_score,
                authority_score: parsed.authority_score,
                lead_generation_score: parsed.lead_generation_score,
                target_persona: parsed.target_persona,
                content_type: parsed.content_type,
                strengths: parsed.strengths || [],
                weaknesses: parsed.weaknesses || []
              }
            }
          });
          console.log(`Fixed post ${p.id}`);
        }
      } catch (e) {
        console.log(`Could not fix post ${p.id}`, e.message);
      }
    }
  }
}
fix().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
