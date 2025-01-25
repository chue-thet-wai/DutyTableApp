<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DutyDate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DutyTableController extends Controller
{
    public function index(Request $request)
    {
        $month = now()->format('m');
        $year  = now()->format('Y');

        $isAdmin = checkUserRole('Administrator');

        $query = User::with(['dutyDates' => function ($query) use ($month, $year) {
            $query->whereMonth('date', $month)->whereYear('date', $year);
        }]);
        if (!$isAdmin) {
            $query = $query->where('id',auth()->id());
        }

        $users = $query->get();

        return Inertia::render('DutyTables/Index', [
            'usersList' => $users, 
            'month' => $month,
            'year' => $year,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function filterDutyTables(Request $request)
    {
        $month = $request->input('month', now()->format('m')); 
        $year  = $request->input('year', now()->format('Y')); 

        $isAdmin = checkUserRole('Administrator');

        $query = User::with(['dutyDates' => function ($query) use ($month, $year) {
            $query->whereMonth('date', $month)->whereYear('date', $year);
        }]);
        if (!$isAdmin) {
            $query = $query->where('id',auth()->id());
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $users = $query->get();
        

        return response()->json([
            'users' => $users
        ]);
    }

    public function saveDutyDate(Request $request)
    {
        $request->validate([
            'userId'      => 'required|exists:users,id',
            'dutyDates'   => 'required|array',
            'dutyDates.*' => 'date',
        ]);

        $user = User::findOrFail($request->userId);
        
        $currentDutyDates = $request->dutyDates;
        $savedDutyDates = $user->dutyDates()->pluck('date')->toArray();
        $datesToAdd = array_diff($currentDutyDates, $savedDutyDates);
        $datesToRemove = array_diff($savedDutyDates, $currentDutyDates);

        //add new selected dates
        foreach ($datesToAdd as $date) {
            DutyDate::create([
                'user_id' => $user->id,
                'date'    => $date,
            ]);
        }

        // delete unselected dates
        DutyDate::where('user_id', $user->id)
            ->whereIn('date', $datesToRemove)
            ->delete();

        return response()->json(['message' => 'Duty dates saved successfully!']);
    }
}
