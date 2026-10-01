<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PklPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PklPeriodController extends Controller
{
    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', PklPeriod::class);

        $periods = PklPeriod::query()
            ->orderByDesc('start_date')
            ->get();

        return response()->json([
            'message' => 'Data periode PKL berhasil diambil.',
            'data' => $periods,
        ]);
    }

    public function show(PklPeriod $pklPeriod): JsonResponse
    {
        Gate::authorize('view', $pklPeriod);

        return response()->json([
            'message' => 'Data periode PKL berhasil diambil.',
            'data' => $pklPeriod,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', PklPeriod::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'is_active' => ['boolean'],
        ]);

        $period = PklPeriod::create($validated);

        return response()->json([
            'message' => 'Periode PKL berhasil ditambahkan.',
            'data' => $period,
        ], 201);
    }

    public function update(
        Request $request,
        PklPeriod $pklPeriod
    ): JsonResponse {
        Gate::authorize('update', $pklPeriod);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $startDate = $validated['start_date'] ?? $pklPeriod->start_date;
        $endDate = $validated['end_date'] ?? $pklPeriod->end_date;

        if (strtotime((string) $endDate) < strtotime((string) $startDate)) {
            return response()->json([
                'message' => 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.',
            ], 422);
        }

        $pklPeriod->update($validated);

        return response()->json([
            'message' => 'Periode PKL berhasil diperbarui.',
            'data' => $pklPeriod->fresh(),
        ]);
    }

    public function destroy(PklPeriod $pklPeriod): JsonResponse
    {
        Gate::authorize('delete', $pklPeriod);

        $pklPeriod->delete();

        return response()->json([
            'message' => 'Periode PKL berhasil dihapus.',
        ]);
    }
}