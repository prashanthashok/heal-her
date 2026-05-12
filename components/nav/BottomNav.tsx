'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './navItems';
import { NavIcon } from './NavIcon';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-t border-cream-dark/40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200
                ${isActive ? 'text-terracotta' : 'text-charcoal/45 hover:text-charcoal/70'}`}
            >
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <NavIcon name={icon} size={20} />
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-terracotta' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
