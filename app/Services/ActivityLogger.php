<?php

namespace App\Services;

use App\Models\ActivityLog;

class ActivityLogger
{
    public static function log(
        string $action,
        ?int $targetId = null,
        array $meta = []
    ): void {
        ActivityLog::create([
            'actor_id'   => auth()->id(),
            'target_id'  => $targetId,
            'action'     => $action,
            'meta'       => $meta,
            'ip'         => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}

