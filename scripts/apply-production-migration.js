#!/usr/bin/env node

// This script applies the custom migration to convert duration to time range
// on the production database
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting production migration script...');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please set it to your production database URL before running this script');
  console.error('Example: DATABASE_URL=postgresql://user:password@host:port/database node scripts/apply-production-migration.js');
  process.exit(1);
}

// Path to the migration SQL file
const migrationFilePath = path.join(__dirname, '../prisma/migrations/20250310_convert_duration_to_time_range/migration.sql');

// Check if migration file exists
if (!fs.existsSync(migrationFilePath)) {
  console.error(`ERROR: Migration file not found at ${migrationFilePath}`);
  process.exit(1);
}

// Execute the migration using Prisma's db execute
try {
  console.log('Running migration to convert duration to time range on production database...');
  
  // Execute the SQL directly using Prisma
  execSync(`npx prisma db execute --file "${migrationFilePath}"`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      // Make sure we're using the production DATABASE_URL
      DATABASE_URL: process.env.DATABASE_URL
    }
  });
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
