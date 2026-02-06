<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| AUTH USER DASHBOARD
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'user'])
    ->get('/dashboard', fn () => Inertia::render('dashboard'))
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| SUPERADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'redirect.usertype', 'superadmin'])
    ->prefix('superadmin')
    ->name('superadmin.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('superadmin/dashboard')
        )->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'redirect.usertype', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('admin/dashboard')
        )->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| KAPRODI
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'redirect.usertype', 'kaprodi'])
    ->prefix('kaprodi')
    ->name('kaprodi.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('kaprodi/dashboard')
        )->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| DOSEN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'redirect.usertype', 'dosen'])
    ->prefix('dosen')
    ->name('dosen.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('dosen/dashboard')
        )->name('dashboard');
    });

require __DIR__.'/settings.php';
