<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $logs = ActivityLog::query()
            ->with(['actor:id,name', 'target:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->where('action', 'like', "%$search%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($l) => [
                'id' => $l->id,
                'actor' => $l->actor?->name ?? 'System',
                'target' => $l->target?->name ?? '-',
                'action' => $l->action,
                'time' => $l->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('superadmin/activity-log', [
            'logs' => $logs,
            'filters' => $request->only('search')
        ]);
    }
}
