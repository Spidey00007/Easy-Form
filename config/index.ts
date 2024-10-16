import { neon, HTTPTransactionOptions } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const URL = process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL as string;

const sql = neon(URL);
    export const db = drizzle(sql,{schema});
