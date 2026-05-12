'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './navItems';
import { NavIcon } from './NavIcon';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-cream-dark/40 shadow-sm">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-cream-dark/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <div>
            <p className="text-base font-semibold text-charcoal leading-tight">Heal Her</p>
            <p className="text-xs text-charcoal/50 leading-tight">90-Day Program</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-charcoal/60 hover:bg-cream-dark/60 hover:text-charcoal'
                }`}
            >
              <span className={isActive ? 'text-terracotta' : 'text-charcoal/50'}>
                <NavIcon name={icon} size={20} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-cream-dark/40">
        <p className="text-xs text-charcoal/40 text-center leading-relaxed">
          Made with care ✦
        </p>
      </div>
    </div>
  );
}
