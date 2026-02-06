import { Link, usePage } from '@inertiajs/react'
import { BookOpen, Folder, LayoutGrid } from 'lucide-react'

import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { dashboard } from '@/routes'
import admin from '@/routes/admin'
import superadmin from '@/routes/superadmin'

import type { NavItem, Usertype } from '@/types'
import AppLogo from './app-logo'
import dosen from '@/routes/dosen'
import kaprodi from '@/routes/kaprodi'

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        usertype: ['user'],
    },
    {
        title: 'Admin Dashboard',
        href: admin.dashboard().url,
        icon: LayoutGrid,
        usertype: ['admin'],
    },
    {
        title: 'Superadmin Dashboard',
        href: superadmin.dashboard().url,
        icon: LayoutGrid,
        usertype: ['superadmin'],
    },
    {
        title: 'dosen Dashboard',
        href: dosen.dashboard().url,
        icon: LayoutGrid,
        usertype: ['dosen'],
    },
    {
        title: 'Kaprodi Dashboard',
        href: kaprodi.dashboard().url,
        icon: LayoutGrid,
        usertype: ['kaprodi'],
    }
]

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
]

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                usertype?: Usertype
            }
        }
    }

    const usertype: Usertype = auth?.user?.usertype ?? 'user'

    const filteredMainNavItems = mainNavItems.filter(
        item => !item.usertype || item.usertype.includes(usertype)
    )

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
