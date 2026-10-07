# Windows Setup Guide for Vaultoria

Since Docker is not available on this system, follow these steps to set up PostgreSQL on Windows:

## Option 1: Install PostgreSQL (Recommended)

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and install PostgreSQL 14 or later
3. During installation, set a password (remember it for .env file)
4. After installation, open pgAdmin or use the command line

### Using pgAdmin (GUI):
1. Open pgAdmin from Start Menu
2. Connect to the server (localhost, port 5432)
3. Right-click on "Databases" → Create → Database
4. Name it "vaultoria"
5. Click Save

### Using Command Line:
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory (usually: `C:\Program Files\PostgreSQL\14\bin`)
3. Run:
```cmd
psql -U postgres
```
4. Enter your password when prompted
5. Run:
```sql
CREATE DATABASE vaultoria;
\q
```

## Option 2: Use a Cloud PostgreSQL Service

If you don't want to install PostgreSQL locally, use a free cloud service:

### Supabase (Free Tier):
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
4. Get the connection string from Settings → Database
5. Update `server/.env` with the connection string

### ElephantSQL (Free Tier):
1. Go to https://www.elephantsql.com
2. Sign up for a free account
3. Create a new instance
4. Get the connection URL
5. Update `server/.env` with the connection string

## Update .env File

After setting up PostgreSQL, update `server/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vaultoria?schema=public"
JWT_SECRET="vaultoria-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

## Run Database Setup

Once PostgreSQL is running and .env is configured:

```bash
npm run db:push
```

This will create all the database tables.

## Start the Game

```bash
# Terminal 1 - Start server
npm run dev:server

# Terminal 2 - Start client
npm run dev:client
```

Open http://localhost:5173 in your browser.

## Troubleshooting

### "Connection refused" error
- Ensure PostgreSQL service is running
- Check Windows Services for "postgresql-x64-14"
- Start the service if it's stopped

### "Password authentication failed"
- Verify the password in .env matches your PostgreSQL password
- Try connecting with pgAdmin to test credentials

### "Database does not exist"
- Run `CREATE DATABASE vaultoria;` in PostgreSQL
- Or use pgAdmin to create the database

### Port 5432 already in use
- Check if another PostgreSQL instance is running
- Change the port in DATABASE_URL and PostgreSQL config
