# 💼 ET Saathi - Financial Decision & Scenario Simulation Engine

## 🚀 Production-Ready AI-Powered Financial Intelligence Platform

**Transform financial news into actionable decisions. Simulate market scenarios. Understand impacts. Make confident investments.**

---

## ✨ Key Features

### 📰 **News Intelligence**
- AI-powered extraction of market impact and sentiment from financial news
- Identifies affected sectors and stocks
- Provides actionable recommendations backed by confidence scores

### 🔮 **Scenario Engine**
- Simulate "what-if" market scenarios
- Model sectoral ripple effects
- Understand portfolio impacts

### 🎯 **Decision Engine**
- Get personalized Buy/Hold/Sell/Avoid recommendations
- Risk-aware suggestions based on your profile
- Explainable reasoning for every decision

### 📊 **Portfolio Simulation**
- Model portfolio performance over time
- Test different asset allocations
- Understand risk/reward trade-offs

### 🔐 **Secure Authentication**
- Supabase-powered authentication
- User-specific dashboards
- Secure data handling

---

## 📋 Stack & Architecture

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom + shadcn/ui patterns
- **Animations**: Framer Motion
- **State Management**: Zustand (ready for integration)

### **Backend**
- **Runtime**: Node.js (Next.js API Routes)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI/LLM**: Google Generative AI (Gemini API)

### **Infrastructure**
- **Deployment**: Vercel
- **Version Control**: Git
- **Package Manager**: npm

### **Theme**
- **Color Scheme**: Black + Gold premium finance theme
- **Design**: Modern dashboard with premium animations
- **Responsive**: Mobile-first, fully responsive UI

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

1. **Clone and navigate to project**
   ```bash
   cd ET_Saathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

---

## 🔧 Setup Guides

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. In Project Settings > API, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Google Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
   ```

### 3. Database Schema (Optional - Manual Setup)

Create these tables in Supabase:

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Analyses Table**
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('news', 'scenario', 'decision', 'simulation')),
  input JSONB,
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Production ready ET Saathi"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Node Version**: 18.x

### Step 3: Add Environment Variables

In Vercel Project Settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Step 4: Deploy

```bash
git push origin main
```

Vercel will automatically build and deploy. View your live app at the provided URL.

---

## 📁 Project Structure

```
ET_Saathi/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes (Gemini, Analysis)
│   │   ├── news/            # News analysis endpoints
│   │   ├── scenarios/        # Scenario simulation endpoints
│   │   ├── decisions/        # Decision engine endpoints
│   │   └── auth/            # Authentication endpoints
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── news/           # News intelligence page
│   │   ├── scenarios/      # Scenario engine page
│   │   ├── decisions/      # Decision engine page
│   │   ├── simulation/     # Portfolio simulation page
│   │   └── history/        # Analysis history page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home/landing page
│
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── index.tsx
│   └── layout/            # Layout components
│       └── DashboardLayout.tsx
│
├── lib/                     # Utilities and services
│   ├── supabase.ts        # Supabase client
│   ├── api-client.ts      # API client singleton
│   └── utils.ts           # Utility functions
│
├── services/               # Business logic services
│   └── gemini.ts          # Gemini AI integration
│
├── hooks/                  # Custom React hooks
│   └── useAuth.ts         # Authentication hook
│
├── types/                  # TypeScript definitions
│   └── index.ts           # All types
│
├── styles/                 # Global styles
│   └── globals.css        # Tailwind styles + custom CSS
│
├── public/                 # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
├── postcss.config.mjs     # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
├── .env.local.example     # Local env template
├── package.json           # Dependencies
└── Readme.md             # This file
```

---

## 📝 API Endpoints

### News Analysis
- **POST** `/api/news/analyze`
- Body:
  ```json
  {
    "news_text": "Financial news content...",
    "user_context": "Optional portfolio context"
  }
  ```

### Scenario Simulation
- **POST** `/api/scenarios/simulate`
- Body:
  ```json
  {
    "scenario_description": "What if...",
    "user_portfolio": [optional portfolio data]
  }
  ```

### Decision Analysis
- **POST** `/api/decisions/analyze`
- Body:
  ```json
  {
    "stock_symbol": "AAPL",
    "current_price": 150.5,
    "market_conditions": "Optional context",
    "user_risk_profile": "moderate"
  }
  ```

---

## 🔐 Security Practices

✅ **Implemented**
- Environment variable protection
- Secure Supabase configuration
- API route protection
- Type-safe code with TypeScript
- Input validation with Zod

**To Add:**
- Rate limiting on API routes
- Request validation middleware
- CORS configuration
- Security headers
- Error boundary components

---

## 🎯 Performance Optimizations

✅ **Implemented**
- Next.js 15 with App Router
- Server-side rendering where applicable
- Image optimization
- CSS minification
- Dead code elimination

**Recommendations:**
- Add image lazy loading
- Implement request caching
- Use Redis for session management
- Add analytics

---

## 🧪 Testing & Quality

### Local Testing
```bash
npm run type-check  # TypeScript validation
npm run lint        # Code quality checks
```

### Pre-deployment Checklist
- [ ] All environment variables set
- [ ] No console errors in browser
- [ ] Build completes successfully: `npm run build`
- [ ] All pages load correctly
- [ ] API endpoints respond correctly
- [ ] Authentication flows work
- [ ] Mobile responsive design verified
- [ ] Performance audit passed

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Supabase connection issues
- Verify environment variables
- Check API keys are correct
- Ensure Supabase project is active

### Gemini API not responding
- Check API key validity
- Verify rate limits not exceeded
- Check request format in API routes

---

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Ready to Deploy!

```bash
# Final verification
npm install
npm run type-check
npm run build

# If everything passes, you're ready to deploy!
git push origin main
```

Your production-ready ET Saathi application is now deployable to Vercel! 🚀

---

**Questions?** Check the project structure, API documentation above, or review environment variable setup.
