#!/usr/bin/env node

import fetch from 'node-fetch';
import { hash } from 'bcryptjs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Vraag om de Vercel deployment URL
rl.question('Wat is de URL van je Vercel deployment? (bijv. https://your-app.vercel.app): ', async (baseUrl) => {
  // Vraag om admin gegevens
  rl.question('Email voor admin account: ', async (email) => {
    rl.question('Wachtwoord voor admin account: ', async (password) => {
      try {
        // Hash het wachtwoord
        const hashedPassword = await hash(password, 12);
        
        console.log(`\nCreating admin user on ${baseUrl}...`);
        
        // Maak de gebruiker aan via de API
        const response = await fetch(`${baseUrl}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: hashedPassword,
            role: 'admin'
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${response.status} ${errorData?.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('\nAdmin gebruiker succesvol aangemaakt:');
        console.log(`Email: ${data?.email || 'Onbekend'}`);
        console.log(`Rol: ${data?.role || 'Onbekend'}`);
        console.log(`ID: ${data?.id || 'Onbekend'}`);
        console.log('\nJe kunt nu inloggen op je Vercel deployment met deze gegevens.');
      } catch (error) {
        console.error('\nFout bij het aanmaken van admin gebruiker:');
        console.error(error instanceof Error ? error.message : String(error));
        console.error('\nControleer of:');
        console.error('1. De Vercel URL correct is');
        console.error('2. De API endpoint beschikbaar is');
        console.error('3. De database correct is geconfigureerd');
      } finally {
        rl.close();
      }
    });
  });
});
