<?

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RecipeHistory;

class RecipeHistoryController extends Controller
{
    public function index()
    {
        return response()->json(RecipeHistory::with(['user', 'recipe'])->get());
    }

    public function show($id)
    {
        $history = RecipeHistory::with(['user', 'recipe'])->findOrFail($id);
        return response()->json($history);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'recipe_id' => 'required|exists:recipes,id',
            'date' => 'required|date',
        ]);

        $history = RecipeHistory::create($validated);
        return response()->json($history, 201);
    }

    public function update(Request $request, $id)
    {
        $history = RecipeHistory::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'recipe_id' => 'required|exists:recipes,id',
            'date' => 'required|date',
        ]);

        $history->update($validated);
        return response()->json($history);
    }

    public function destroy($id)
    {
        $history = RecipeHistory::findOrFail($id);
        $history->delete();

        return response()->json(['message' => 'Recipe history deleted']);
    }
}
