import { Head, router, Link } from '@inertiajs/react'
import {
    RotateCcw,
    MoreHorizontal,
    UserCheck,
    FilterX,
    Terminal,
    ChevronRight,
    ShieldCheck
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

// Shadcn UI
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import AppLayout from '@/layouts/app-layout'
import type { BreadcrumbItem } from '@/types'

const BASE_URL = '/superadmin/data'

type User = {
    id: number
    name: string
    email: string
    usertype: string
    created_at: string
    is_current_user?: boolean
}

type PaginationLink = {
    url: string | null
    label: string
    active: boolean
}

type Props = {
    users: {
        data: User[]
        links: PaginationLink[]
    }
    filters: {
        search?: string
        role?: string
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SuperAdmin', href: '#' },
    { title: 'User Management', href: BASE_URL },
]

export default function Data({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [role, setRole] = useState(filters.role ?? 'all')
    const [debouncedSearch] = useDebounce(search, 500)

    useEffect(() => {
        router.get(
            BASE_URL,
            {
                search: debouncedSearch || undefined,
                role: role === 'all' ? undefined : role,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        )
    }, [debouncedSearch, role])

    const handleResetPassword = (id: number, name: string) => {
        if (!confirm(`Reset password untuk ${name}?`)) return
        router.post(`${BASE_URL}/${id}/reset-password`, {}, { preserveScroll: true })
    }

    const handleChangeRole = (id: number, newRole: string) => {
        router.patch(`${BASE_URL}/${id}/role`, { role: newRole }, { preserveScroll: true })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management | Console" />
            <div className="p-4 md:p-8 space-y-6 max-w-7xl font-sans">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1 font-mono">
                            <Terminal size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest leading-none">
                                USER_DATABASE_ACCESS_V1.0
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                            User Management
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-md italic">
                            Administrative control panel for managing access levels and credentials.
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-3 bg-neutral-100 p-2 rounded-lg border border-neutral-200">
                        <div className="bg-white px-3 py-1 rounded shadow-sm border text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Total</p>
                            <p className="text-sm font-mono font-bold">{users.data.length} pts</p>
                        </div>
                        <ShieldCheck className="text-emerald-500 h-5 w-5 mr-1" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-8 relative group font-mono">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-emerald-600">
                            <ChevronRight size={18} />
                        </div>
                        <Input
                            placeholder="query user --search..."
                            className="pl-10 bg-white border-neutral-300 focus:ring-emerald-500/20 rounded-none border-l-4 border-l-emerald-500 h-11"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-4 flex gap-2">
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="h-11 bg-white">
                                <SelectValue placeholder="Access Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Access Levels</SelectItem>
                                <SelectItem value="superadmin">SuperAdmin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="dosen">Lecturer</SelectItem>
                                <SelectItem value="kaprodi">Head of Dept</SelectItem>
                                <SelectItem value="user">Student</SelectItem>
                            </SelectContent>
                        </Select>

                        {(search || role !== 'all') && (
                            <Button variant="outline" className="h-11 px-3 border-dashed" onClick={() => { setSearch(''); setRole('all') }}>
                                <FilterX className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="shadow-xl rounded-sm overflow-hidden border-neutral-200">
                    <div className="bg-neutral-100 px-4 py-2 flex items-center gap-2 border-b border-neutral-200">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono font-bold ml-2">
                            root@system:~ user-management.db
                        </span>
                    </div>

                    <Table>
                        <TableHeader className="bg-neutral-50">
                            <TableRow className="border-neutral-200">
                                <TableHead className="w-[100px] font-mono text-[11px] uppercase tracking-tighter"># ID</TableHead>
                                <TableHead className="font-mono text-[11px] uppercase tracking-tighter">User Identity</TableHead>
                                <TableHead className="font-mono text-[11px] uppercase tracking-tighter">Access Level</TableHead>
                                <TableHead className="font-mono text-[11px] uppercase tracking-tighter">Joined</TableHead>
                                <TableHead className="text-right font-mono text-[11px] uppercase tracking-tighter">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {users.data.map((u) => (
                                <TableRow key={u.id} className={`group hover:bg-emerald-50/30 transition-colors ${u.is_current_user ? 'bg-emerald-50/20' : ''}`}>
                                    <TableCell className="font-mono text-xs text-muted-foreground italic">
                                        {String(u.id).padStart(4, '0')}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-neutral-900 flex items-center gap-2">
                                                {u.name}
                                                {u.is_current_user && (
                                                    <Badge variant="outline" className="h-4 text-[9px] uppercase border-emerald-500 text-emerald-600 bg-emerald-50">Self</Badge>
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono">{u.email}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={`rounded-sm font-mono text-[10px] uppercase px-2 py-0.5 ${
                                            u.usertype === 'superadmin' ? 'bg-neutral-900' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                                        }`}>
                                            {u.usertype}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {u.created_at}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white border hover:shadow-sm" disabled={u.is_current_user}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 font-mono">
                                                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Modify Access</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {['admin', 'dosen', 'kaprodi', 'user'].map((r) => (
                                                    <DropdownMenuItem
                                                        key={r}
                                                        onClick={() => handleChangeRole(u.id, r)}
                                                        disabled={u.usertype === r}
                                                        className="capitalize text-xs"
                                                    >
                                                        <UserCheck className="mr-2 h-3.5 w-3.5" />
                                                        Set to {r}
                                                    </DropdownMenuItem>
                                                ))}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleResetPassword(u.id, u.name)}
                                                    className="text-destructive text-xs"
                                                >
                                                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                        System::Output - Page_{users.links.find(l => l.active)?.label || '1'}
                    </p>
                    <div className="flex gap-1">
                        {users.links.map((link, i) => (
                            <Button
                                key={i}
                                size="sm"
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                className={`h-8 font-mono text-xs rounded-none ${link.active ? 'bg-emerald-600' : ''}`}
                                asChild
                            >
                                <Link
                                    href={link.url ?? ''}
                                    preserveState
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
