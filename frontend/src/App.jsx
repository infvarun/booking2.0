import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Invoice from './pages/Invoice'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  )
}
