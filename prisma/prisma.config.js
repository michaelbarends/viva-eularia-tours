// Dit script bepaalt dynamisch welke database URL moet worden gebruikt
// afhankelijk van de omgeving (lokaal of Vercel)

function getDatabaseUrl() {
  // Controleer eerst of we in een Vercel omgeving zijn
  if (process.env.POSTGRES_PRISMA_URL) {
    console.log('Vercel Postgres database URL gevonden');
    return process.env.POSTGRES_PRISMA_URL;
  }
  
  // Controleer of er een DATABASE_URL is ingesteld
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
