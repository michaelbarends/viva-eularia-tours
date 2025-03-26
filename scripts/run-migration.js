// This script runs the custom migration to convert duration to time range
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the migration SQL file
const migrationFilePath = path.join(__dirname, '../prisma/migrations/20250310_convert_duration_to_time_range/migration.sql');

// Read the migration SQL
const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');

// Execute the migration using Prisma's db execute
try {
  console.log('Running migration to convert duration to time range...');
  
  // Execute the SQL directly using Prisma
  execSync(`npx prisma db execute --file "${migrationFilePath}"`, { stdio: 'inherit' });
  
  // Generate Prisma client with the updated schema
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
