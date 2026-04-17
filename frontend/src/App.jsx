import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import HallsPage from './pages/HallsPage'
import ItemsPage from './pages/ItemsPage'
import Invoice from './pages/Invoice'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/halls" element={<HallsPage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Route>
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  )
}
