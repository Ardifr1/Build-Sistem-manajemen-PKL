<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\PklPlacement;
use App\Models\ProgressRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProgressRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', ProgressRecord::class);

        $validated = $request->validate([
            'placement_id' => [
                'required',
                'integer',
                'exists:pkl_placements,id',
            ],
        ]);

        $placement = PklPlacement::findOrFail($validated['placement_id']);

        if (! Gate::forUser($request->user())->check('view', $placement)) {
            abort(403);
        }

        $records = ProgressRecord::query()
            ->with('placement')
            ->where('placement_id', $validated['placement_id'])
            ->orderByDesc('recorded_date')
            ->get();

        return response()->json([
            'message' => 'Data perkembangan PKL berhasil diambil.',
            'data' => $records,
        ]);
    }

    public function show(ProgressRecord $progressRecord): JsonResponse
    {
        Gate::authorize('view', $progressRecord);

        $progressRecord->load('placement');

        return response()->json([
            'message' => 'Data perkembangan PKL berhasil diambil.',
            'data' => $progressRecord,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', ProgressRecord::class);

        $validated = $request->validate([
            'placement_id' => [
                'required',
                'integer',
                'exists:pkl_placements,id',
            ],
            'recorded_by' => [
                'sometimes',
                'integer',
                'exists:users,id',
            ],
            'recorded_by_role' => [
                'sometimes',
                'string',
                'max:50',
                'in:teacher,company,admin',
            ],
            'development' => [
                'required',
                'string',
            ],
            'note' => [
                'nullable',
                'string',
            ],
            'recorded_date' => [
                'required',
                'date',
            ],
        ]);

        // Catatan perkembangan selalu tercatat atas nama user yang sedang login.
        $validated['recorded_by'] = $request->user()->id;
        $validated['recorded_by_role'] = $request->user()->role;

        $placement = PklPlacement::findOrFail($validated['placement_id']);

        if (! Gate::forUser($request->user())->check('view', $placement)) {
            abort(403);
        }

        $record = ProgressRecord::create($validated);

        $record->load('placement');

        return response()->json([
            'message' => 'Catatan perkembangan PKL berhasil ditambahkan.',
            'data' => $record,
        ], 201);
    }

    public function update(
        Request $request,
        ProgressRecord $progressRecord
    ): JsonResponse {
        Gate::authorize('update', $progressRecord);

        $validated = $request->validate([
            'development' => [
                'sometimes',
                'string',
            ],
            'note' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'recorded_date' => [
                'sometimes',
                'date',
            ],
        ]);

        $progressRecord->update($validated);

        $progressRecord->load('placement');

        return response()->json([
            'message' => 'Catatan perkembangan PKL berhasil diperbarui.',
            'data' => $progressRecord,
        ]);
    }

    public function destroy(ProgressRecord $progressRecord): JsonResponse
    {
        Gate::authorize('delete', $progressRecord);

        $progressRecord->delete();

        return response()->json([
            'message' => 'Catatan perkembangan PKL berhasil dihapus.',
        ]);
    }
}