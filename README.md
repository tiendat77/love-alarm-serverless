# Love Alarm Serverless Functions

## Firebase Admin

- Generate new private key at Firebase Console > Project Settings > Service accounts > Firebase Admin SDK

- Add these properties from generated json to `.env`:

```
FIREBASE_PROJECT_ID=<project_id>
FIREBASE_CLIENT_EMAIL=<client_email>
FIREBASE_PRIVATE_KEY=<private_key>
```

# Supabase

Config environments `.env`:

```
  SUPABASE_URL=<Your Supabase URL>
  SUPABASE_SERVICE_KEY=<Your Supabase Service Key (Not anon public key. This key has the ability to bypass Row Level Security.)>
  SUPABASE_JWT_SECRET=<Your Supabase JWT Secret (Used to decode your JWTs)>
```