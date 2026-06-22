const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const brands = await prisma.brand.findMany();
  for (const b of brands) {
    console.log(`Brand: ${b.brandName} (${b.id})`);
    console.log(`  Personal connected: ${b.linkedinPersonalConnected}`);
    console.log(`  Company connected: ${b.linkedinCompanyConnected}`);
    if (b.linkedinCompanyToken) {
       console.log(`  Fetching orgs...`);
       try {
           const res = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED', {
                headers: {
                    'Authorization': `Bearer ${b.linkedinCompanyToken}`,
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`  Success! Orgs:`, data.elements?.length || 0);
            } else {
                console.log(`  Error:`, data.message || data);
            }
       } catch(e) {
           console.log(`  Fetch error:`, e.message);
       }
    }
  }
}
check();
