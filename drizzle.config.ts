import { defineConfig } from "drizzle-kit";

//const databaseUrl = process.env.DRIZZLE_DATABASE_URL as string;

export default defineConfig({
  schema: "./config/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://EayFormAI_owner:UIJZhW8u5wCr@ep-wandering-truth-a53ouunv.us-east-2.aws.neon.tech/EayFormAI?sslmode=require',
  }
});
