import { Routes, Route, Navigate } from 'react-router-dom'
import HelloWorld from './pages/HelloWorld'
import NotFound from './pages/NotFound'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/hello" replace />} />
            <Route path="/hello" element={<HelloWorld />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
