'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/hooks/useApp'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface NavLink {
  href: string
  label: string
  visible: boolean
}

export function Navbar() {
  const pathname = usePathname()
  const { hasPermission } = useApp()

  const links: NavLink[] = [
    {
      href: '/reports',
      label: 'Reportes',
      visible: hasPermission('CAN_VIEW_REPORTS'),
    },
    {
      href: '/monitors',
      label: 'Monitores',
      visible: hasPermission('CAN_CREATE_MONITOR') || hasPermission('CAN_EDIT_MONITOR'),
    },
    {
      href: '/users',
      label: 'Usuarios y Roles',
      visible:
        hasPermission('CAN_CREATE_USER') ||
        hasPermission('CAN_EDIT_USER') ||
        hasPermission('CAN_CREATE_ROLE') ||
        hasPermission('CAN_EDIT_ROLE'),
    },
  ]

  const visibleLinks = links.filter((l) => l.visible)

  return (
    <nav className="uss-mainnav">
      <div className="uss-mainnav__wrap" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text-strong)',
              whiteSpace: 'nowrap',
            }}
          >
            Plataforma BI USS
          </span>

          {visibleLinks.length > 0 && (
            <ul className="uss-mainnav__items">
              {visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <li key={link.href} className="uss-mainnav__item">
                    <Link
                      href={link.href}
                      className={`uss-mainnav__item-link${isActive ? ' active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
