# Migratie van 'duur' naar 'tijdsbereik' voor tussenstops

Deze migratie verandert het datamodel voor tussenstops van een enkele 'duur' (in minuten) naar een tijdsbereik met 'startTime' en 'endTime' velden.

## Wijzigingen

1. Het `duration` veld in het `Stop` model is vervangen door:
   - `startTime`: Starttijd in HH:MM formaat
   - `endTime`: Eindtijd in HH:MM formaat

2. De volgende bestanden zijn aangepast:
   - `prisma/schema.prisma`: Schema definitie bijgewerkt
   - `src/types/tour.d.ts`: TypeScript types bijgewerkt
   - `src/app/tours/components/TourForm.tsx`: Formulier aangepast om tijdsbereik te gebruiken
   - `src/components/TourMap.tsx`: Kaart component bijgewerkt
   - `src/components/TourMapWrapper.tsx`: Interface bijgewerkt
   - `src/app/tour/[id]/page.tsx`: Tour pagina bijgewerkt

## Migratie uitvoeren

Om de database te migreren van het oude schema naar het nieuwe schema, volg deze stappen:

1. Zorg ervoor dat je database een backup heeft (voor het geval er iets misgaat)

2. Voer het migratiescript uit:

```bash
node scripts/run-migration.js
```

Dit script zal:
- De nieuwe kolommen `startTime` en `endTime` toevoegen aan de `Stop` tabel
- Bestaande records bijwerken met standaard waarden (09:00 - 10:00)
- De kolommen als niet-nullable markeren
- De oude `duration` kolom verwijderen
- De Prisma client opnieuw genereren

## Handmatige migratie (indien nodig)

Als je de migratie handmatig wilt uitvoeren, kun je de volgende stappen volgen:

1. Voer de SQL commando's uit in `prisma/migrations/20250310_convert_duration_to_time_range/migration.sql`
2. Genereer de Prisma client opnieuw:

```bash
npx prisma generate
```

## Testen

Na de migratie kun je de applicatie testen door:

1. De applicatie te starten:

```bash
npm run dev
```

2. Navigeer naar een bestaande tour om te controleren of de tijden correct worden weergegeven
3. Maak een nieuwe tour aan om te controleren of het formulier correct werkt

## Rollback (indien nodig)

Als je de migratie ongedaan wilt maken, kun je de volgende SQL commando's uitvoeren:

```sql
ALTER TABLE "Stop" ADD COLUMN "duration" INTEGER;
UPDATE "Stop" SET "duration" = 60; -- Of een andere standaardwaarde
ALTER TABLE "Stop" ALTER COLUMN "duration" SET NOT NULL;
ALTER TABLE "Stop" DROP COLUMN "startTime";
ALTER TABLE "Stop" DROP COLUMN "endTime";
```

Vergeet niet om daarna de Prisma client opnieuw te genereren:

```bash
npx prisma generate
