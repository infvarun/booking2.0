import { NavLink } from 'react-router-dom'
import { CalendarDays, Building2, Package, LayoutDashboard } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Bookings', end: true },
  { to: '/halls', icon: Building2, label: 'Halls' },
  { to: '/items', icon: Package, label: 'Items' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-slate-950 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/60">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/40">
          <CalendarDays className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight tracking-tight">Deo Vihar</p>
          <p className="text-slate-500 text-xs">Booking System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 pt-2 pb-1.5">
          Manage
        </p>
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-slate-600 text-xs">v2.0 · Modern Stack</p>
        </div>
      </div>
    </aside>
  )
}
