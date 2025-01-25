<?php

use App\Http\Controllers\Auth\TenantController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()->route('tenant.login');
});

Route::middleware('guest')->group(function(){
    Route::get('tenant_login', [TenantController::class, 'showTenantLoginForm'])->name('tenant.login');
    Route::post('tenant_login', [TenantController::class, 'tenantLogin']);
    Route::get('tenant_register', [TenantController::class, 'showTenantRegistrationForm'])->name('tenant.register');
    Route::post('tenant_register', [TenantController::class, 'tenantRegister']);

    Route::get('register', [TenantController::class, 'create'])
                ->name('register');

    Route::post('register', [TenantController::class, 'store']);
});

