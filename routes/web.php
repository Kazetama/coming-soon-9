<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'user'])
    ->get('/dashboard', fn () => Inertia::render('dashboard'))
    ->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth/superadmin.php';
require __DIR__.'/auth/admin.php';
require __DIR__.'/auth/kaprodi.php';
require __DIR__.'/auth/dosen.php';
