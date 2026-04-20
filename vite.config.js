import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5128',
        changeOrigin: true,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/context/AuthContext.jsx',
        'src/context/ThemeContext.jsx',
        'src/components/ProtectedRoute.jsx',
        'src/components/InternshipCard.jsx',
        'src/components/CompetitionCard.jsx',
        'src/components/Modal.jsx',
        'src/components/StatsCard.jsx',
        'src/services/internshipService.js',
        'src/api/authApi.js',
        'src/api/adminApi.js',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 75,
        statements: 85,
      }
    }
  }
})
