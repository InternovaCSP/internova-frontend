# Internova Frontend

> React.js frontend for **Internova — University Internship & Industry Matching Portal**  
> Student, Company, and Admin portals built with Vite + React + TailwindCSS.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vite](https://vitejs.dev/) | v6 | Build tool & dev server |
| [React](https://react.dev/) | v19 | UI framework |
| [React Router DOM](https://reactrouter.com/) | v7 | Client-side routing |
| [TailwindCSS](https://tailwindcss.com/) | v4 | Utility-first CSS |
| [Axios](https://axios-http.com/) | v1 | HTTP client |
| [Formik](https://formik.org/) | v2 | Form management |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd internova-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and set VITE_API_BASE_URL to your backend URL
```

### Running Locally

```bash
npm run dev
```

The app will start at **http://localhost:5173**

### Other Commands

```bash
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
internova-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers (auth, theme, etc.)
│   ├── pages/               # Route-level page components
│   │   ├── HelloWorld.jsx   # /hello — routing smoke test
│   │   └── NotFound.jsx     # * — 404 page
│   ├── services/
│   │   └── api.js           # Configured Axios instance
│   ├── App.jsx              # Route definitions
│   ├── main.jsx             # App entry point (BrowserRouter)
│   └── index.css            # TailwindCSS import
├── index.html
├── vite.config.js
├── .env.example             # Environment variable template
└── package.json
```

---

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | — | Redirects to `/hello` |
| `/hello` | `HelloWorld` | Routing smoke test page |
| `*` | `NotFound` | 404 catch-all |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# .env.local
VITE_API_BASE_URL=http://localhost:5000
```

> All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## API Client

A pre-configured Axios instance is available at `src/services/api.js`:

```js
import api from './services/api'

// Example usage
const response = await api.get('/internships')
```

**Features:**
- Base URL from `VITE_API_BASE_URL` env variable
- Automatically attaches `Authorization: Bearer <token>` from `localStorage`
- Globally handles `401 Unauthorized` (clears token)

---

## Contributing

1. Branch from `main` using the ticket convention: `CSP-<id>-short-description`
2. Make your changes and ensure `npm run lint` passes
3. Commit with the ticket reference: `CSP-<id> Short description`
4. Open a Pull Request targeting `main`

---

## Related

- **Backend API**: [`internova-backend`](../internova-backend) — ASP.NET Core Web API (Clean Architecture)
