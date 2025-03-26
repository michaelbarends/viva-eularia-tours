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
const fs = require('fs');
const path = require('path');

try {
  console.log('Genereer Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Controleer of we in een Vercel omgeving zijn en of dit de eerste deployment is
  // Als dit de eerste deployment is, moeten we de schema aanmaken
  if (process.env.VERCEL === '1') {
    console.log('Vercel omgeving gedetecteerd, voer aangepaste migratie uit...');
    
    try {
      // Probeer de database te initialiseren met een aangepaste aanpak
      console.log('Initialiseer database schema...');
      
      // Gebruik prisma db push in plaats van migrate deploy
      // Dit zorgt ervoor dat het schema wordt aangemaakt zonder migraties
      console.log('Voer prisma db push uit...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      
      // Voer ook de aangepaste migratie uit voor duration naar time range
      console.log('Voer aangepaste migratie uit voor duration naar time range...');
      const migrationFilePath = path.join(__dirname, '../prisma/migrations/20250310_convert_duration_to_time_range/migration.sql');
      if (fs.existsSync(migrationFilePath)) {
        console.log('Migratie bestand gevonden, voer uit...');
        execSync(`npx prisma db execute --file "${migrationFilePath}"`, { stdio: 'inherit' });
        console.log('Aangepaste migratie succesvol uitgevoerd');
      } else {
        console.log('Migratie bestand niet gevonden, sla over');
      }
      
      console.log('Database schema succesvol geïnitialiseerd');
    } catch (initError) {
      console.error('WAARSCHUWING: Kon database schema niet initialiseren:', initError.message);
      console.error('Probeer verder te gaan met seeding...');
    }
  } else {
    // Lokale omgeving, gebruik normale migratie
    console.log('Lokale omgeving, voer normale migratie uit...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  }
  
  console.log('Voer database seeding uit...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('Database migraties en seeding succesvol uitgevoerd');
} catch (error) {
  console.error('FOUT bij uitvoeren van database migraties of seeding:', error.message);
  process.exit(1);
}
