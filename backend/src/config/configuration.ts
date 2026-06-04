// /backend/src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  azure: {
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    blobConnectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    keyVaultUrl: process.env.AZURE_KEY_VAULT_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  inactivityTimeoutMs: parseInt(process.env.INACTIVITY_TIMEOUT_MS ?? '1800000', 10),
});