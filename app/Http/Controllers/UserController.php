<?php
namespace App\Http\Controllers;

use App\Exports\ExportUserList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class UserController extends Controller
{
 
    public function index(Request $request)
    {
        $positions = config('constant.positions');
        $users = User::with('roles')->paginate(10);
        return Inertia::render('Users/Index', [
            'usersList'  => $users,
            'positions'    => $positions
        ]);
    }

    public function filterUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');

        $query = User::with('roles');

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('email', 'like', '%' . $search . '%');
        }

        $users = $query->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'total' => $users->total(),
        ]);
    }

    public function create(Request $request)
    {
        $constant_positions = config('constant.positions');
        $positions = [];

        foreach ($constant_positions as $key => $label) {
            $positions[] = ['value' => $key, 'label' => $label];
        }

        return Inertia::render('Users/Form', [
            'positions' => $positions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required',
            'position' => 'required',
            'password' => 'required|string|min:5',
            'role' => 'required|string',
        ]);

        $userID = generateUserID();
        if ($request->hasFile('profile')) {
            $image = $request->file('profile');
            $extension = $image->extension();
            $image_name = $userID . "_" . time() . "." . $extension;
        } else {
            $image_name = "";
        }

        $user = User::create([
            'user_id' => $userID,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'position' => $request->position,
            'password' => Hash::make($request->password),
            'profile' => $image_name,
            'created_by' => auth()->id(),
        ]);

        $user->assignRole($request->role);

        if ($image_name != '') {
            $tenantId = tenant()->id;
            $directory = "images/profiles/$tenantId";

            //make directory if not exist
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }
            $image->move(public_path($directory), $image_name);
        }

        return Redirect::route('users.index');
    }

    public function edit(User $user)
    {
        $constant_positions = config('constant.positions');
        $positions = [];

        foreach ($constant_positions as $key => $label) {
            $positions[] = ['value' => $key, 'label' => $label];
        }

        $user->load('roles');

        return Inertia::render('Users/Form', [
            'user' => $user,
            'positions' => $positions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user= User::find($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'required',
            'position' => 'required',
            'password' => 'nullable|string|min:5',
            'role' => 'required|string'
        ]);

        $userID = $user->id;
        if ($request->hasFile('profile')) {
            $image = $request->file('profile');
            $extension = $image->extension();
            $image_name = $userID . "_" . time() . "." . $extension;
        } else {
            $image_name = "";
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'position' => $request->position,
            'updated_by' => auth()->id(),
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        if ($image_name != '') {
            $tenantId = tenant()->id;
            $directory = "images/profiles/$tenantId";

            //make directory if not exist
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            $previous_img = $user->profile;
            @unlink(public_path($directory .''. $previous_img));
            $image->move(public_path($directory), $image_name);

            $user->update([
                'profile' => $image_name,
            ]);
            
        }

        $user->syncRoles([$request->role]);

        return Redirect::route('users.index');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully!']);
    }

    public function export(Request $request) 
    {
        $selectedUserIds = $request->input('selectedUsers');
    
        $positions = config('constant.positions');

        $query = User::with('roles');
        if ($selectedUserIds) {
            $query = $query->whereIn('id', $selectedUserIds);
        }
        $result = $query->orderBy('created_at')
                    ->get();

        $resultData = [];
        foreach ($result as $res) {
            $userRole = $res->roles->first();
            $resArr = [
                'name'           => $res->name,
                'email'          => $res->email,
                'phone'          => $res->phone,
                'position'       => $positions[$res->position],
                'role'           => $userRole->name,
                'created_at'     => $res->created_at ? date('Y-m-d H:i:s', strtotime($res->created_at)) : ''
            ];

            $resultData[] = $resArr;
        }

        return Excel::download(new ExportUserList($resultData), 'userslist_export.csv');
    }
    

}
