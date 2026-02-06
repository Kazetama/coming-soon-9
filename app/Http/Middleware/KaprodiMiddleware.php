<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KaprodiMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->usertype !== 'kaprodi') {
            return redirect()->route(
                match ($user->usertype) {
                    'superadmin' => 'superadmin.dashboard',
                    'admin' => 'admin.dashboard',
                    'dosen' => 'dosen.dashboard',
                    'user' => 'dashboard',
                    default => 'dashboard',
                }
            );
        }

        return $next($request);
    }
}
