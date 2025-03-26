#!/usr/bin/env node

// This script uses the Vercel CLI to run a one-time command on your Vercel production environment
// to fix the database schema issue without requiring a full redeployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel database fix script...');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('ERROR: Vercel CLI is not installed or not in PATH');
  console.error('Please install it with: npm install -g vercel');
  process.exit(1);
}

// Check if user is logged in to Vercel
try {
  console.log('Checking Vercel login status...');
  execSync('vercel whoami', { stdio: 'ignore' });
} catch (error) {
  console.error('ERROR: Not logged in to Vercel CLI');
  console.error('Please login with: vercel login');
  process.exit(1);
}

// Check if force reset flag is provided
const forceReset = process.argv.includes('--force-reset');

// Create a temporary script to run on Vercel
const tempScriptPath = path.join(__dirname, 'temp-vercel-fix.js');
const migrationFilePath = '../prisma/migrations/20250310_convert_duration_to_time_range/migration.sql';

// Create the temporary script content
const tempScriptContent = `
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Running database fix on Vercel environment...');

// Path to the migration SQL file
const migrationFilePath = path.join(__dirname, '${migrationFilePath}');

// Check if migration file exists
if (!fs.existsSync(migrationFilePath)) {
  console.error(\`ERROR: Migration file not found at \${migrationFilePath}\`);
  process.exit(1);
}

${forceReset ? `
// Force reset the database and apply schema
console.log('Force reset flag detected. Resetting database and applying schema...');
execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
console.log('Database reset and schema applied successfully!');
console.log('WARNING: All data has been deleted from the database.');
` : `
// Try to run the migration
try {
  console.log('Running migration to convert duration to time range...');
  execSync(\`npx prisma db execute --file "\${migrationFilePath}"\`, { stdio: 'inherit' });
  console.log('Migration completed successfully!');
  
  // Apply any other schema changes
  console.log('Applying any remaining schema changes...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('Schema changes applied successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  console.error('If you want to reset the database and lose all data, run this script with --force-reset');
  process.exit(1);
}
`}

console.log('Database fix completed successfully!');
`;

// Write the temporary script
fs.writeFileSync(tempScriptPath, tempScriptContent);
console.log(`Created temporary script at ${tempScriptPath}`);

try {
  // Run the script on Vercel
  console.log('Running fix on Vercel production environment...');
  console.log('This may take a few minutes...');
  
  execSync(`vercel run --prod "node ${path.basename(tempScriptPath)}"`, { 
    stdio: 'inherit',
    cwd: path.dirname(tempScriptPath)
  });
  
  console.log('Vercel database fix completed successfully!');
} catch (error) {
  console.error('Failed to run fix on Vercel:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary script
  fs.unlinkSync(tempScriptPath);
  console.log(`Removed temporary script ${tempScriptPath}`);
}
