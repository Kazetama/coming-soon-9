<?php

use App\Http\Controllers\SuperAdmin\ActivityLogController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\DataController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'superadmin', 'redirect.usertype'])
    ->prefix('superadmin')
    ->name('superadmin.')
    ->group(function () {

        Route::get('/dashboard', DashboardController::class)
            ->name('dashboard');

        Route::prefix('data')->name('data.')->group(function () {
            Route::get('/', [DataController::class, 'index'])->name('index');
            Route::patch('/{user}/role', [DataController::class, 'updateRole'])->name('role');
            Route::post('/{user}/reset-password', [DataController::class, 'resetPassword'])->name('reset');
        });

        Route::get('/activity-log', [ActivityLogController::class, 'index'])
            ->name('activity.index');
    });
