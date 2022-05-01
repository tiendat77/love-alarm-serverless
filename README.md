# Love Alarm Serverless Functions

## Firebase Admin

- Generate new private key at Firebase Console > Project Settings > Service accounts > Firebase Admin SDK

- Replace `firebase-admin.json` with generated file

# Supabase

Config environments `.env`:

```
  PORT=8080
  SUPABASE_URL=<Your Supabase URL>
  SUPABASE_SERVICE_KEY=<Your Supabase Service Key (Not anon public key. This key has the ability to bypass Row Level Security.)>
  SUPABASE_JWT_SECRET=<Your Supabase JWT Secret (Used to decode your JWTs)>
```