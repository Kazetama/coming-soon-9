import type { InertiaLinkProps } from '@inertiajs/react'
import type { LucideIcon } from 'lucide-react'

export type Usertype =
    | 'user'
    | 'admin'
    | 'superadmin'
    | 'kaprodi'
    | 'dosen'

export type BreadcrumbItem = {
    title: string
    href: string
}

export type NavItem = {
    title: string
    href: NonNullable<InertiaLinkProps['href']>
    icon?: LucideIcon | null
    isActive?: boolean
    usertype?: Usertype[]
}
