import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const required = ["RDS_HOST", "RDS_DATABASE", "RDS_USER", "RDS_PASSWORD"];
for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[cloudorbit-backend] Warning: missing env var ${key}. Check your .env file.`);
  }
}

export const pool = new Pool({
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT ? Number(process.env.RDS_PORT) : 5432,
  database: process.env.RDS_DATABASE,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  ssl:
    process.env.RDS_SSL === "false"
      ? undefined
      : { rejectUnauthorized: false },
  max: 5,
});

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error on idle RDS client", err);
});
