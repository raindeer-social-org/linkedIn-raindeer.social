const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const brand = await prisma.brand.findUnique({where: {id: '34ee3a07-dbcf-4ad4-8fcd-39827d186d91'}});
  const token = brand.linkedinCompanyToken;
  
  // Try versioned API
  const res = await fetch('https://api.linkedin.com/rest/organizationAcls?q=roleAssignee', {
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'LinkedIn-Version': '202401',
      'X-Restli-Protocol-Version': '2.0.0'
    }
  });
  const data = await res.json();
  console.log('Versioned API Data:', JSON.stringify(data, null, 2));
}
test().catch(console.error).finally(() => prisma.$disconnect());
