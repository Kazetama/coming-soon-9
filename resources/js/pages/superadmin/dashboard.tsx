import { Head } from '@inertiajs/react'
import {
    Users,
    Activity,
    Terminal,
    ShieldCheck,
    TrendingUp,
    LayoutDashboard,
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'

type Stats = {
    total_users: number
    active_sessions: number
    system_health: string
    pending_verifications: number
}

type Distribution = {
    mahasiswa: number
    dosen: number
    kaprodi: number
    admin: number
}

type Log = {
    id: number
    action: string
    target_id: number | string
    created_at: string
}

type GrowthData = {
    date: string
    count: number
}

type Props = {
    stats: Stats
    distribution: Distribution
    growth: GrowthData[]
    recentLogs: Log[]
}

export default function Dashboard({ stats, distribution, growth, }: Props) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Superadmin Console', href: '/superadmin/dashboard' },
            ]}
        >
            <Head title="System Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8 font-sans bg-neutral-50/30 dark:bg-neutral-950">
                <div className="flex flex-col gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-mono">
                        <Terminal size={16} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                            STATUS: CORE_SYSTEM_OPERATIONAL
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Dashboard
                        </h1>
                        <Badge variant="outline" className="font-mono text-[10px] uppercase border-emerald-500/50 text-emerald-600">
                            Auto-Sync: Active
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total_users}</div>
                            <div className="mt-2 flex gap-1">
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{distribution.mahasiswa} MHS</Badge>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{distribution.dosen} DSN</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Sessions</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.active_sessions}</div>
                            <p className="text-[10px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
                                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" /> Real-time Activity
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Verifications</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.pending_verifications}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 italic">Pending Approval</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-emerald-600 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white/80">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">System Health</CardTitle>
                            <LayoutDashboard className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter italic">STABLE</div>
                            <p className="text-[10px] text-white/70 mt-1 font-mono uppercase tracking-widest">Lat: 24ms</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-7">
                    <Card className="md:col-span-4 border-none shadow-sm bg-white dark:bg-neutral-900 overflow-hidden">
                        <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <TrendingUp size={16} className="text-emerald-500" /> User Registration Trend
                            </CardTitle>
                            <CardDescription className="text-[11px]">Daily growth metrics over the last 7 days.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growth}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} />
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
