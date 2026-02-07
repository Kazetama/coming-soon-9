<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'actor_id',
        'target_id',
        'action',
        'meta',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /* ================= Relations ================= */

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function target()
    {
        return $this->belongsTo(User::class, 'target_id');
    }
}
