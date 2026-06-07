const prisma = require('./lib/prisma');
async function main() {
  const posts = await prisma.post.findMany();
  console.log('Total posts in database:', posts.length);
  console.log(posts);
}
main().catch(console.error).finally(() => prisma.$disconnect());
