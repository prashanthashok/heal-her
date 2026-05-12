'use client';

import {
  Home,
  CalendarDays,
  Utensils,
  Leaf,
  BookOpen,
  PenLine,
} from 'lucide-react';

const icons = { Home, CalendarDays, Utensils, Leaf, BookOpen, PenLine };

type IconName = keyof typeof icons;

export function NavIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = icons[name as IconName];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={1.8} />;
}
