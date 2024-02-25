import pkg from 'pg';
const { Client } = pkg;

export const client = new Client({ // set client
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '1111',
});

await client.connect();// get connection
