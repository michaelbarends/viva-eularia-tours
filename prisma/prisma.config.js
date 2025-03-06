// Dit script bepaalt dynamisch welke database URL moet worden gebruikt
// afhankelijk van de omgeving (lokaal of Vercel)

function getDatabaseUrl() {
  // Debug informatie over de omgeving
  console.log('Omgevingsvariabelen debug:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL:', process.env.VERCEL);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('POSTGRES_PRISMA_URL exists:', !!process.env.POSTGRES_PRISMA_URL);
  
  // Controleer eerst of we in een Vercel omgeving zijn
  if (process.env.VERCEL === '1') {
    if (process.env.POSTGRES_PRISMA_URL) {
      console.log('Vercel Postgres database URL gevonden');
      return process.env.POSTGRES_PRISMA_URL;
    }
    
    // Als we op Vercel zijn maar geen POSTGRES_PRISMA_URL hebben, gebruik een dummy URL
    // Dit zorgt ervoor dat prisma generate werkt, maar zal falen bij migraties
    console.log('WAARSCHUWING: Op Vercel maar geen POSTGRES_PRISMA_URL gevonden');
    return 'postgresql://dummy:dummy@dummy:5432/dummy';
  }
  
  // Controleer of er een DATABASE_URL is ingesteld voor lokale ontwikkeling
  if (process.env.DATABASE_URL) {
    console.log('Lokale database URL gevonden');
    return process.env.DATABASE_URL;
  }
  
  // Fallback voor lokale ontwikkeling
  console.log('Geen database URL gevonden, gebruik standaard lokale URL');
  return 'postgresql://postgres:postgres@localhost:5432/viva_eularia';
}

// Exporteer de database URL
module.exports = {
  databaseUrl: getDatabaseUrl()
};
