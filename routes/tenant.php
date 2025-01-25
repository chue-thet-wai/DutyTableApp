<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DutyTableController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/', function () {
        return auth()->check() 
        ? redirect()->route('duty_tables.index') 
        : redirect()->route('login');
    });

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::middleware(['auth','check_permission'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
        Route::resource('users', UserController::class);
        Route::post('/users/update/{id}', [UserController::class, 'update'])->name('users.update_user');
        Route::get('/filter_users', [UserController::class, 'filterUsers']);
        Route::post('/export-users', [UserController::class, 'export']);
    
        Route::resource('duty_tables', DutyTableController::class);
        Route::get('/filter_duty_tables', [DutyTableController::class, 'filterDutyTables']);
        Route::post('/save_duty_date', [DutyTableController::class, 'saveDutyDate']);
        
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    
    });
});
