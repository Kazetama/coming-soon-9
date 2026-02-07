import { Head, router, Link } from '@inertiajs/react'
import {
    Search,
    RotateCcw,
    MoreHorizontal,
    UserCheck,
    FilterX
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

// Shadcn
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

/* ================= CONSTANT ================= */

const BASE_URL = '/superadmin/data'

/* ================= TYPES ================= */

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

/* ================= BREADCRUMB ================= */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SuperAdmin', href: '#' },
    { title: 'User Management', href: BASE_URL },
]

/* ================= PAGE ================= */

export default function Data({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [role, setRole] = useState(filters.role ?? 'all')
    const [debouncedSearch] = useDebounce(search, 500)

    /* ================= AUTO FILTER ================= */

    useEffect(() => {
        router.get(
            BASE_URL,
            {
                search: debouncedSearch || undefined,
                role: role === 'all' ? undefined : role,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        )
    }, [debouncedSearch, role])

    /* ================= ACTIONS ================= */

    const handleResetPassword = (id: number, name: string) => {
        if (!confirm(`Reset password untuk ${name}?`)) return

        router.post(
            `${BASE_URL}/${id}/reset-password`,
            {},
            { preserveScroll: true }
        )
    }

    const handleChangeRole = (id: number, newRole: string) => {
        router.patch(
            `${BASE_URL}/${id}/role`,
            { role: newRole },
            { preserveScroll: true }
        )
    }

    /* ================= RENDER ================= */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="p-4 md:p-8 space-y-6 max-w-7xl">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola hak akses dan reset kredensial pengguna.
                    </p>
                </div>

                {/* Filter */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">

                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama/email..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Semua Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Role</SelectItem>
                                <SelectItem value="superadmin">SuperAdmin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="dosen">Dosen</SelectItem>
                                <SelectItem value="kaprodi">Kaprodi</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>

                        {(search || role !== 'all') && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearch('')
                                    setRole('all')
                                }}
                            >
                                <FilterX className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Bergabung</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {users.data.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>#{u.id}</TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {u.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {u.email}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className="capitalize">
                                            {u.usertype}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {u.created_at}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">

                                                <DropdownMenuLabel>Ubah Role</DropdownMenuLabel>

                                                {['admin','dosen','kaprodi','user'].map((r) => (
                                                    <DropdownMenuItem
                                                        key={r}
                                                        onClick={() => handleChangeRole(u.id, r)}
                                                        disabled={u.usertype === r}
                                                        className="capitalize"
                                                    >
                                                        <UserCheck className="mr-2 h-4 w-4" />
                                                        {r}
                                                    </DropdownMenuItem>
                                                ))}

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() => handleResetPassword(u.id, u.name)}
                                                    className="text-destructive"
                                                >
                                                    <RotateCcw className="mr-2 h-4 w-4" />
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

                {/* Pagination */}
                <div className="flex gap-2">
                    {users.links.map((link, i) => (
                        <Button
                            key={i}
                            size="sm"
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
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
        </AppLayout>
    )
}
