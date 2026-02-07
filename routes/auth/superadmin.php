<?php

use App\Http\Controllers\SuperAdmin\ActivityLogController;
use App\Http\Controllers\SuperAdmin\DataController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'redirect.usertype', 'superadmin'])
    ->prefix('superadmin')
    ->name('superadmin.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('superadmin/dashboard')
        )->name('dashboard');

        // list
        Route::get('/data', [DataController::class, 'index'])->name('data');

        // update role
        Route::patch('/data/{user}/role', [DataController::class, 'updateRole'])
            ->name('data.role');

        // reset password
        Route::post('/data/{user}/reset-password', [DataController::class, 'resetPassword'])
            ->name('data.reset');

        // activity log
        Route::get('/activity-log', [ActivityLogController::class, 'index'])
            ->name('activity-log');
    });
