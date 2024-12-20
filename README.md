# CoreFlow - AI-Powered Fitness Platform

CoreFlow is a modern fitness platform that leverages artificial intelligence to provide personalized workout plans and comprehensive progress tracking tools.

## Features

- 🤖 AI-Generated Workout Plans
- 📊 Progress Tracking
- 💳 Subscription Management
- 📱 Responsive Design
- 🔒 User Authentication
- 📈 Analytics Dashboard

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - React Query

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - OpenAI API

- **Authentication & Payments:**
  - NextAuth.js
  - Stripe

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
OPENAI_API_KEY="sk-..."
```

## Project Structure

```
src/
├── app/                 # App router pages
├── components/          # Reusable components
├── lib/                 # Utility functions
├── types/              # TypeScript types
└── styles/             # Global styles
```

## API Routes

- `POST /api/generate-workout` - Generate personalized workout plans
- `GET/POST /api/progress` - Track user progress
- `POST /api/subscribe` - Handle subscription management

## License

MIT
