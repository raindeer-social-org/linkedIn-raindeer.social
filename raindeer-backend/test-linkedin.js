require('dotenv').config();
const prisma = require('./lib/prisma');

async function main() {
  const brand = await prisma.brand.findFirst();
  if (!brand || !brand.linkedinAccessToken) {
    console.log("No token found");
    return;
  }
  
  const authorUrn = encodeURIComponent(`urn:li:person:${brand.linkedinPersonId}`);
  const url = `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${authorUrn})&count=10`;
  console.log("Fetching:", url);
  
  const res = await fetch(url, {
      headers: {
          'Authorization': `Bearer ${brand.linkedinAccessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
      }
  });
  
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
