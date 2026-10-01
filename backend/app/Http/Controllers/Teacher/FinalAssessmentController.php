<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\FinalAssessment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FinalAssessmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', FinalAssessment::class);

        $validated = $request->validate([
            'placement_id' => [
                'nullable',
                'integer',
                'exists:pkl_placements,id',
            ],
        ]);

        $query = FinalAssessment::query()
            ->with([
                'placement',
            ])
            ->orderByDesc('finalized_at');

        if (isset($validated['placement_id'])) {
            $query->where(
                'placement_id',
                $validated['placement_id']
            );
        }

        return response()->json([
            'message' => 'Data penilaian akhir berhasil diambil.',
            'data' => $query->get(),
        ]);
    }

    public function show(FinalAssessment $finalAssessment): JsonResponse
    {
        Gate::authorize('view', $finalAssessment);

        $finalAssessment->load([
            'placement',
        ]);

        return response()->json([
            'message' => 'Data penilaian akhir berhasil diambil.',
            'data' => $finalAssessment,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', FinalAssessment::class);

        $validated = $request->validate([
            'placement_id' => [
                'required',
                'integer',
                'exists:pkl_placements,id',
            ],
            'final_score' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
                'decimal:0,2',
            ],
            'status' => [
                'required',
                'string',
                'max:50',
                'in:draft,approved,rejected',
            ],
            'finalized_by' => [
                'sometimes',
                'integer',
                'exists:users,id',
            ],
        ]);

        // Penilaian akhir selalu tercatat atas nama user yang sedang login.
        $validated['finalized_by'] = $request->user()->id;

        $placement = \App\Models\PklPlacement::findOrFail($validated['placement_id']);

        if (! Gate::forUser($request->user())->check('view', $placement)) {
            abort(403);
        }

        $existingAssessment = FinalAssessment::query()
            ->where(
                'placement_id',
                $validated['placement_id']
            )
            ->exists();

        if ($existingAssessment) {
            return response()->json([
                'message' => 'Penilaian akhir untuk penempatan tersebut sudah tersedia.',
            ], 422);
        }

        $finalAssessment = FinalAssessment::create([
            ...$validated,
            'finalized_at' => now(),
        ]);

        $finalAssessment->load([
            'placement',
        ]);

        return response()->json([
            'message' => 'Penilaian akhir berhasil disimpan.',
            'data' => $finalAssessment,
        ], 201);
    }

    public function update(
        Request $request,
        FinalAssessment $finalAssessment
    ): JsonResponse {
        Gate::authorize('update', $finalAssessment);

        $validated = $request->validate([
            'final_score' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:100',
                'decimal:0,2',
            ],
            'status' => [
                'sometimes',
                'string',
                'max:50',
                'in:draft,approved,rejected',
            ],
        ]);

        $finalAssessment->update($validated);

        $finalAssessment->load([
            'placement',
        ]);

        return response()->json([
            'message' => 'Penilaian akhir berhasil diperbarui.',
            'data' => $finalAssessment,
        ]);
    }    public function destroy(FinalAssessment $finalAssessment): JsonResponse
    {
        Gate::authorize('delete', $finalAssessment);

        $finalAssessment->delete();

        return response()->json([
            'message' => 'Penilaian akhir berhasil dihapus.',
        ]);
    }
}