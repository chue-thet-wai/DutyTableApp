<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    
    public function showTenantLoginForm()
    {
        if (session()->has('tenant')) {
            session()->forget('tenant');
        }
        return Inertia::render('Auth/TenantLogin'); 
    }

    public function tenantLogin(Request $request)
    {
        $request->validate([
            'tenant_id' => 'required|string|exists:tenants,id',
        ]);
        try {
            $tenant = Tenant::find($request->tenant_id);
            $domainData = $tenant->domains()->first();
            if ($domainData){
                $domain = $domainData->domain;
            } else {
                return back()->withErrors(['error' => 'Domain not found.']);
            }
               
            $scheme = request()->getScheme();
            $port = request()->getPort();
            if ($port) {
                $redirectUrl = $scheme."://".$domain . ':' . $port;
            } else {
                $redirectUrl = $scheme."://".$domain;
            }

            return Inertia::location($redirectUrl . "/login");

        } catch (\Exception $e) {
            Log::error("Tenant login error: {$e->getMessage()}");
            return back()->withErrors(['error' => 'Unable to redirect to tenant.']);
        }

    }

   
    public function showTenantRegistrationForm()
    {
        $tenant = session('tenant');
        return Inertia::render('Auth/TenantRegister',[
            'tenant' => $tenant,
        ]);
    }

   
    public function tenantRegister(Request $request)
    {
        $validated = $request->validate([
            'tenant_id'       => 'required|string|unique:tenants,id',
            'company_name'    => 'required|string|max:255'
        ]);

        session(['tenant' => $validated]);

        return redirect()->route('register');
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $constant_positions = config('constant.positions');
        $positions = [];

        foreach ($constant_positions as $key => $label) {
            $positions[] = ['value' => $key, 'label' => $label];
        }
       
        return Inertia::render('Auth/Register',[
            'positions' => $positions
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'position' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
        ]);

        // Retrieve the tenant from session
        $tenantData = session('tenant');

        if (!$tenantData) {
            return redirect()->route('register')->withErrors(['tenant' => 'No tenant data found.']);
        }

        try {
            //create tenant
            $tenant = Tenant::create([
                'id' => $tenantData['tenant_id'], 
                'company_name' => $tenantData['company_name']
            ]);            

            
            // create domain
            $domainName = $tenantData['tenant_id'] . '.' . config('tenancy.central_domains')[1];
            $tenant->createDomain(['domain' => $domainName]);

            //create user
            $tenant->run(function () use ($request) {
                $user =User::create([
                        'user_id'  => generateUserID(),
                        'name'     => $request->name,
                        'email'    => $request->email,
                        'position' => $request->position,
                        'password' => bcrypt($request->password), 
                        'phone'    => $request->phone,
                    ]);
                $user->assignRole('Administrator');
            });

            // Clear the tenant session
            session()->forget('tenant');

            return redirect()->route('tenant.login')->with('success', 'Registration completed successfully.');

        } catch (\Exception $e) {
            Log::error('Error during tenant registration: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);
            return redirect()->route('register')->withErrors(['error' => 'An error occurred during registration.']);
        }
    }
}
