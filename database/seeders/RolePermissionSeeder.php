<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Define permissions
        $permissions = [
            'users.index', 
            'users.create', 
            'users.edit', 
            'users.destroy',
            'duty_tables.index',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission, 
                'guard_name' => 'web'
            ]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Administrator']);
        $userRole = Role::firstOrCreate(['name' => 'User']);

       
        $adminRole->syncPermissions($permissions);

        
        $userPermissions = [
            'duty_tables.index',
        ];
        $userRole->syncPermissions($userPermissions);

    }
}
