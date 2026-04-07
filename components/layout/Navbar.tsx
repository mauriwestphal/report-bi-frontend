'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/hooks/useApp'
import { hasPermission } from '@/lib/auth/permissions'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface NavLink {
  href: string
  label: string
  visible: boolean
}

export function Navbar() {
  const pathname = usePathname()
  const { user } = useApp()

  const links: NavLink[] = [
    {
      href: '/reports',
      label: 'Reportes',
      visible: hasPermission(user, 'CAN_VIEW_REPORTS'),
    },
    {
      href: '/monitors',
      label: 'Monitores',
      visible: hasPermission(user, 'CAN_CREATE_MONITOR') || hasPermission(user, 'CAN_EDIT_MONITOR'),
    },
    {
      href: '/users',
      label: 'Usuarios y Roles',
      visible:
        hasPermission(user, 'CAN_CREATE_USER') ||
        hasPermission(user, 'CAN_EDIT_USER') ||
        hasPermission(user, 'CAN_CREATE_ROLE') ||
        hasPermission(user, 'CAN_EDIT_ROLE'),
    },
  ]

  const visibleLinks = links.filter((l) => l.visible)

  return (
    <nav className="bg-background border-b border-border">
      <div className="px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-8 flex-1">
          <span className="font-bold text-base text-foreground whitespace-nowrap">
            Plataforma BI USS
          </span>

          {visibleLinks.length > 0 && (
            <ul className="flex items-center gap-4">
              {visibleLinks.map((link) => {
                const isActive = pathname?.startsWith(link.href) || false
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
