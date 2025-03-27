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

// Check if force reset flag is provided
const forceReset = process.argv.includes('--force-reset');

// Execute the migration
try {
  if (forceReset) {
    console.log('Force reset flag detected. Resetting database and applying schema...');
    
    // Use prisma db push with force-reset to reset the database and apply schema
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL
      }
    });
    
    console.log('Database reset and schema applied successfully!');
    console.log('WARNING: All data has been deleted from the database.');
  } else {
    console.log('Skipping migration for duration to time range (columns already exist)');
    
    // Apply any other schema changes
    console.log('Applying any remaining schema changes...');
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL
      }
    });
    
    console.log('Schema changes applied successfully!');
  }
} catch (error) {
  console.error('Operation failed:', error);
  process.exit(1);
}
