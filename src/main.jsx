/**
 * main.jsx
 * Entry point for the InterNova React frontend application.
 * Bootstraps the React DOM, wraps the application in StrictMode for development checks,
 * initializes React Router (BrowserRouter), and injects the global Authentication Context.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
