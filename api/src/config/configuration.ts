export default () => ({
  port: parseInt(process.env.PORT ?? "3000", 10),
  databaseUrl: process.env.DATABASE_URL,
  baseUrl: process.env.BASE_URL,
  googleApiKey: process.env.GOOGLE_AI_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY ?? "3600s",
});
