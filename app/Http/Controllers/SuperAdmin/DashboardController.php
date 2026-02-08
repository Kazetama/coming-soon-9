<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        if ($request->user()->usertype !== 'superadmin') {
            abort(403, 'UNAUTHORIZED_ACCESS');
        }

        return Inertia::render('superadmin/dashboard', [
            'stats' => $this->stats(),
            'distribution' => $this->distribution(),
            'growth' => $this->userGrowth(),
            'recentLogs' => $this->recentLogs(),
        ]);
    }

    private function stats(): array
    {
        return [
            'total_users' => User::count(),
            'active_sessions' => $this->activeSessions(),
            'system_health' => 'OK',
            'pending_verifications' => User::whereNull('email_verified_at')->count(),
        ];
    }

    private function activeSessions(): int
    {
        return DB::table('sessions')->count();
    }

    private function distribution(): array
    {
        return [
            'mahasiswa' => User::where('usertype', 'user')->count(),
            'dosen' => User::where('usertype', 'dosen')->count(),
            'kaprodi' => User::where('usertype', 'kaprodi')->count(),
            'admin' => User::whereIn('usertype', ['admin', 'superadmin'])->count(),
        ];
    }

    private function userGrowth(): array
    {
        return User::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get()
            ->toArray();
    }

    private function recentLogs()
    {
        if (!class_exists(SystemLog::class)) {
            return [];
        }

        return SystemLog::latest()
            ->take(8)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => strtoupper($log->action),
                'target_id' => $log->target_id ?? 'N/A',
                'created_at' => $log->created_at->diffForHumans(),
            ]);
    }
}
