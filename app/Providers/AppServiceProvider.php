<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('tenant', function () {
            if (tenant()) {
                return [
                    'id' => tenant('id'),
                    'company_name' => tenant('company_name'), 
                ];
            }

            return null; 
        });
        Inertia::share([
            'auth' => fn () => auth()->user(),
            'roles' => fn() => Auth::check() ? Auth::user()->roles : [],
        ]);
    }
}
