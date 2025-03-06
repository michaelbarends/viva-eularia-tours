# Viva Eularia Tours

Een applicatie voor het beheren van tours en gebruikers voor Viva Eularia.

## Lokale ontwikkeling

1. Kloon de repository
2. Installeer de dependencies:
   ```bash
   npm install
   ```
3. Start de PostgreSQL database met Docker:
   ```bash
   docker-compose up -d
   ```
4. Maak een `.env` bestand aan met de volgende inhoud:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viva_eularia"
   NEXTAUTH_SECRET="je-geheime-sleutel"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="je-google-maps-api-key"
   ```
5. Voer de database migraties uit:
   ```bash
   npx prisma migrate dev
   ```
6. Seed de database:
   ```bash
   npx prisma db seed
   ```
7. Start de ontwikkelserver:
   ```bash
   npm run dev
   ```
8. Open [http://localhost:3000](http://localhost:3000) in je browser

## Deployen op Vercel

### Stap 1: Maak een Vercel project aan

1. Ga naar [Vercel](https://vercel.com) en log in of maak een account aan
2. Klik op "New Project"
3. Importeer je GitHub repository
4. Configureer het project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

### Stap 2: Voeg een Vercel Postgres database toe

1. Ga naar je project dashboard
2. Klik op "Storage" in de navigatie
3. Klik op "Connect Database"
4. Selecteer "Vercel Postgres"
5. Volg de stappen om een nieuwe Postgres database aan te maken
6. Vercel zal automatisch de volgende omgevingsvariabelen toevoegen:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### Stap 3: Voeg de overige omgevingsvariabelen toe

Ga naar "Settings" > "Environment Variables" en voeg de volgende variabelen toe:

```
DATABASE_URL=${POSTGRES_PRISMA_URL}
NEXTAUTH_SECRET=je-geheime-sleutel
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=je-google-maps-api-key
```

> **Belangrijk**: De `DATABASE_URL` moet verwijzen naar de `POSTGRES_PRISMA_URL` die Vercel automatisch instelt. Daarnaast wordt in het postbuild script in package.json de `POSTGRES_PRISMA_URL` gebruikt voor database migraties en seeding.

### Stap 4: Deployy

1. Ga terug naar het "Deployments" tabblad
2. Klik op "Redeploy" om een nieuwe deployment te starten met de nieuwe omgevingsvariabelen
3. Wacht tot de deployment is voltooid

### Stap 5: Inloggen

Na de deployment kun je inloggen met de volgende gegevens:
- Email: admin@viva-eularia.nl
- Wachtwoord: admin123

## Technische detailss

### Database

De applicatie gebruikt PostgreSQL voor zowel lokale ontwikkeling als productie:
- Lokaal: PostgreSQL via Docker
- Productie: Vercel Postgres

De database schema is gedefinieerd in `prisma/schema.prisma`.

### Authenticatie

De applicatie gebruikt NextAuth.js voor authenticatie. Gebruikers kunnen inloggen met email en wachtwoord. Alleen gebruikers met de rol "admin" hebben toegang tot de admin interface.

### Structuur

- `/src/app`: Next.js App Router pagina's
- `/src/components`: Herbruikbare React componenten
- `/src/lib`: Utility functies en configuratie
- `/prisma`: Database schema en migraties
