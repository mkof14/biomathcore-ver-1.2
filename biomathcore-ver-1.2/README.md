# BioMath Core

Personalized health insights powered by AI.

## Development Environment Setup

This guide provides a clear, step-by-step process to set up a local development environment. This project uses Next.js, Prisma, and SQLite.

**Step 1: Install Dependencies**
First, ensure you have Node.js installed. Then, install the project dependencies using npm:
```bash
npm install
```

**Step 2: Create Environment File**
Create a `.env` file in the root of the project. You can copy the example file:
```bash
cp .env.local.example .env
```
Now, open the `.env` file and add the following two critical variables. You can leave the other API keys blank for now if you are only working on the questionnaire feature.

```dotenv
# --------------------------------------------------
# Add these two lines to your .env file
# --------------------------------------------------
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="a8b2c5d5e9f1a3b4c7d8e2f0a1b3c5d6e8f2a4b6c8d7e1f0a3b5c7d9e2f1a4b6" # Replace with your own secret
```

**Step 3: Set Up and Migrate the Database**
This command will create the SQLite database file and run all necessary migrations to set up the tables.
```bash
npx prisma migrate dev
```

**Step 4: Seed the Database**
This command will populate the database with initial data, such as the questionnaires and a test user.
```bash
npm run seed
```

**Step 5: Run the Development Server**
You are now ready to start the application.
```bash
npm run dev
```
The application should be available at [http://localhost:3000](http://localhost:3000).

---

### Test User Credentials
After seeding the database, you can log in with the following credentials:
- **Email:** `test@test.com`
- **Password:** (any password will work)
