const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const brand = await prisma.brand.findUnique({where: {id: '34ee3a07-dbcf-4ad4-8fcd-39827d186d91'}});
  const token = brand.linkedinCompanyToken;
  
  const res = await fetch('https://api.linkedin.com/v2/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('User Data:', JSON.stringify(data, null, 2));
}
test().catch(console.error).finally(() => prisma.$disconnect());
