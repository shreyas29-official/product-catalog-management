import { NavLink } from 'react-router-dom';

export default function Sidebar({ links }) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-20 space-y-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
