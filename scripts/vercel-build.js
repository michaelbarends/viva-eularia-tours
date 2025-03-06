#!/usr/bin/env node

// Dit script wordt gebruikt om de database migraties en seeding uit te voeren tijdens Vercel builds
// Het stelt de DATABASE_URL in op basis van de POSTGRES_PRISMA_URL die Vercel automatisch instelt

console.log('Vercel build script gestart');
console.log('Omgevingsvariabelen debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('POSTGRES_PRISMA_URL exists:', !!process.env.POSTGRES_PRISMA_URL);

// Controleer of we in een Vercel omgeving zijn
if (process.env.VERCEL === '1') {
  if (process.env.POSTGRES_PRISMA_URL) {
    console.log('Vercel Postgres database URL gevonden, stel DATABASE_URL in');
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
  } else {
    console.error('FOUT: POSTGRES_PRISMA_URL niet gevonden in Vercel omgeving');
    console.error('Zorg ervoor dat je een Vercel Postgres database hebt toegevoegd aan je project');
    process.exit(1);
  }
}

// Voer de database migraties en seeding uit
const { execSync } = require('child_process');

try {
  console.log('Voer database migraties uit...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('Voer database seeding uit...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('Database migraties en seeding succesvol uitgevoerd');
} catch (error) {
  console.error('FOUT bij uitvoeren van database migraties of seeding:', error.message);
  process.exit(1);
}
