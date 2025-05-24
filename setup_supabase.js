const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection string from Supabase
const connectionString = 'postgresql://postgres.eoxsgdeuiaqnivxcfxpi:Tccfesa123%@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

async function setupSupabase() {
  const client = new Client({
    connectionString,
  });

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'supabase_setup.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute SQL
    await client.query(sqlContent);

    console.log('Supabase setup completed successfully!');
    console.log('Created news_articles table with required structure');
  } catch (error) {
    console.error('Error in setup process:', error);
  } finally {
    // Close the connection
    await client.end();
    console.log('Database connection closed');
  }
}

setupSupabase();
