#!/usr/bin/env node

// Dit script maakt een admin gebruiker aan via de API
// Gebruik: node scripts/create-admin-user.js <base-url> <email> <password>

const fetch = require('node-fetch');

async function createAdminUser(baseUrl, email, password) {
  console.log(`Creating admin user ${email} at ${baseUrl}...`);
  
  try {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        role: 'admin'
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${data.error || 'Unknown error'}`);
    }
    
    console.log('Admin user created successfully:');
    console.log(data);
  } catch (error) {
    console.error('Error creating admin user:');
    console.error(error.message);
    process.exit(1);
  }
}

// Haal de command line arguments op
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error('Usage: node scripts/create-admin-user.js <base-url> <email> <password>');
  console.error('Example: node scripts/create-admin-user.js https://your-app.vercel.app admin@example.com password123');
  process.exit(1);
}

const [baseUrl, email, password] = args;

// Maak de admin gebruiker aan
createAdminUser(baseUrl, email, password);
