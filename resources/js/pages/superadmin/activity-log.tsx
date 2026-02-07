import { Head, router, Link } from '@inertiajs/react'
import {
    Terminal,
    Cpu,
    Clock,
    User,
    ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'


const BASE_URL = '/superadmin/activity-log'

type Log = {
    id: number
    actor: string
    target: string
    action: string
    time: string
}

type Props = {
    logs: {
        data: Log[]
        links: { url: string | null; label: string; active: boolean }[]
    }
    filters: {
        search?: string
    }
}

export default function ActivityLog({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [debounced] = useDebounce(search, 400)

    useEffect(() => {
        router.get(BASE_URL, { search: debounced || undefined }, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        })
    }, [debounced])

    const getActionStyle = (action: string) => {
        if (action.includes('update') || action.includes('edit')) return 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950'
        if (action.includes('delete') || action.includes('reset')) return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950'
        if (action.includes('create') || action.includes('add')) return 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950'
        return 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950'
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'SuperAdmin', href: '/superadmin/data' },
            { title: 'System Logs', href: BASE_URL }
        ]}>
            <Head title="System Logs | Console" />
            <div className="p-4 md:p-8 space-y-6 max-w-7xl font-mono">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-1">
                            <Terminal size={18} className="animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">System Monitor v1.0</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-white">ACTIVITY_LOG</h1>
                        <p className="text-neutral-500 text-sm max-w-md">
                            Real-time transaction monitoring and administrative audit trails.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-neutral-100 dark:bg-black/40 p-3 rounded-lg border border-neutral-200 dark:border-white/5 backdrop-blur-sm">
                        <div className="flex flex-col items-center px-4 border-r border-neutral-300 dark:border-white/10">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold">Status</span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ONLINE
                            </span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold">Recorded</span>
                            <span className="text-xs text-neutral-900 dark:text-white font-bold">{logs.data.length} entries</span>
                        </div>
                    </div>
                </div>

                <div className="relative group max-w-2xl">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-500">
                        <ChevronRight size={18} />
                    </div>
                    <Input
                        placeholder="grep action_name --search..."
                        className="pl-10 bg-white dark:bg-black border-neutral-300 dark:border-emerald-500/20 text-neutral-900 dark:text-emerald-400 placeholder:text-neutral-400 dark:placeholder:text-emerald-900 focus:ring-emerald-500/20 rounded-none border-l-4 border-l-emerald-500 shadow-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <Card className="bg-white dark:bg-black border-neutral-200 dark:border-white/10 shadow-xl rounded-sm overflow-hidden border-t-4 border-t-emerald-500">
                    <div className="bg-neutral-100 dark:bg-neutral-900/50 px-4 py-2 flex items-center gap-2 border-b border-neutral-200 dark:border-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-[10px] text-neutral-500 font-bold ml-2">root@system:~ audit-trails</span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-neutral-50 dark:bg-neutral-900">
                                <TableRow className="border-neutral-200 dark:border-white/5 hover:bg-transparent">
                                    <TableHead className="text-neutral-500 dark:text-emerald-500/70 py-4 uppercase text-[10px] tracking-widest font-bold"># ID</TableHead>
                                    <TableHead className="text-neutral-500 dark:text-emerald-500/70 uppercase text-[10px] tracking-widest font-bold">Actor</TableHead>
                                    <TableHead className="text-neutral-500 dark:text-emerald-500/70 uppercase text-[10px] tracking-widest font-bold">Target</TableHead>
                                    <TableHead className="text-neutral-500 dark:text-emerald-500/70 uppercase text-[10px] tracking-widest font-bold">Process</TableHead>
                                    <TableHead className="text-neutral-500 dark:text-emerald-500/70 uppercase text-[10px] tracking-widest font-bold text-right">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {logs.data.length > 0 ? (
                                    logs.data.map((l) => (
                                        <TableRow key={l.id} className="border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <TableCell className="text-neutral-400 dark:text-neutral-600 group-hover:text-emerald-500 transition-colors">
                                                {String(l.id).padStart(4, '0')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-neutral-400" />
                                                    <span className="text-neutral-700 dark:text-neutral-300 font-bold">{l.actor}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Cpu size={12} className="text-neutral-400" />
                                                    <span className="text-neutral-600 dark:text-neutral-400">{l.target}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getActionStyle(l.action)}`}>
                                                    {l.action.toUpperCase()}
                                                </span >
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 text-neutral-500 dark:text-neutral-500 text-[11px]">
                                                    <Clock size={12} />
                                                    {l.time}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center text-neutral-400 dark:text-emerald-900 italic">
                                            -- NO_MATCHING_LOGS_FOUND --
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-neutral-400 font-bold">
                        SYSTEM_OUTPUT: PAGE_{logs.links.find(l => l.active)?.label || '1'}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {logs.links.map((link, i) => (
                            <Button
                                key={i}
                                asChild
                                size="sm"
                                variant="ghost"
                                className={`
                                    rounded-none border h-8 font-mono text-[10px]
                                    ${link.active
                                        ? 'bg-emerald-600 dark:bg-emerald-500/10 border-emerald-600 dark:border-emerald-500/50 text-white dark:text-emerald-500'
                                        : 'border-neutral-200 dark:border-white/5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5'}
                                    ${!link.url && 'opacity-30 pointer-events-none'}
                                `}
                            >
                                <Link
                                    href={link.url ?? ''}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                    preserveState
                                />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
