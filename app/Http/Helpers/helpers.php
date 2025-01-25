<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

function checkUserRole($roleName, $user = null)
{
    $user = $user ?? Auth::user();
    if (!$user) {
        return false;
    }
    $roleId = Role::where('name', $roleName)->pluck('id')->first();
    return $user->roles()->where('id', $roleId)->exists();
}

function generateUserID() 
{
    $found = true;  
    $characters = '1234567890';
    $length = 9;
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    while ($found) {
        $result = User::where('user_id',$randomString)->first();    
        if ($result) {
            $found=true;
        }else{
            $found=false;
        }    
    }
    return $randomString;  
}
