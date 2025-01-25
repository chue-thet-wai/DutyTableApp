<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;

class CheckPermission
{
    public function handle(Request $request, Closure $next)
    {
        $routeName = $request->route()->getName();
        $permissionExists = Permission::where('name', $routeName)->exists();

        if ($permissionExists) {
            if (!auth()->user()->can($routeName)) {
                abort(403, 'Unauthorized');
            }
        }
        return $next($request);
    }
}
