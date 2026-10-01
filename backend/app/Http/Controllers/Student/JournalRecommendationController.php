<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\JournalRecommendation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class JournalRecommendationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'journal_id' => [
                'required',
                'integer',
                'exists:journals,id',
            ],
        ]);

        // Rekomendasi mengikuti ownership jurnal (mencegah IDOR antar siswa).
        $journal = Journal::findOrFail($validated['journal_id']);

        Gate::authorize('view', $journal);

        $recommendations = JournalRecommendation::query()
            ->where('journal_id', $validated['journal_id'])
            ->orderBy('id')
            ->get();

        return response()->json([
            'message' => 'Rekomendasi jurnal berhasil diambil.',
            'data' => $recommendations,
        ]);
    }

    public function show(
        JournalRecommendation $journalRecommendation
    ): JsonResponse {
        Gate::authorize('view', $journalRecommendation->journal);

        $journalRecommendation->load('journal');

        return response()->json([
            'message' => 'Rekomendasi jurnal berhasil diambil.',
            'data' => $journalRecommendation,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'journal_id' => [
                'required',
                'integer',
                'exists:journals,id',
            ],
            'recommendation' => [
                'required',
                'string',
            ],
            'is_selected' => [
                'sometimes',
                'boolean',
            ],
            'is_applied' => [
                'sometimes',
                'boolean',
            ],
        ]);

        // Hanya pihak yang boleh mengelola jurnal (pemilik/guru/admin)
        // yang dapat menambah rekomendasi pada jurnal tersebut.
        $journal = Journal::findOrFail($validated['journal_id']);

        Gate::authorize('update', $journal);

        $recommendation = JournalRecommendation::create([
            'journal_id' => $validated['journal_id'],
            'recommendation' => $validated['recommendation'],
            'is_selected' => $validated['is_selected'] ?? false,
            'is_applied' => $validated['is_applied'] ?? false,
        ]);

        return response()->json([
            'message' => 'Rekomendasi jurnal berhasil ditambahkan.',
            'data' => $recommendation,
        ], 201);
    }

    public function update(
        Request $request,
        JournalRecommendation $journalRecommendation
    ): JsonResponse {
        Gate::authorize('update', $journalRecommendation->journal);

        $validated = $request->validate([
            'recommendation' => [
                'sometimes',
                'string',
            ],
            'is_selected' => [
                'sometimes',
                'boolean',
            ],
            'is_applied' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $journalRecommendation->update($validated);

        return response()->json([
            'message' => 'Rekomendasi jurnal berhasil diperbarui.',
            'data' => $journalRecommendation->fresh(),
        ]);
    }

    public function destroy(
        JournalRecommendation $journalRecommendation
    ): JsonResponse {
        Gate::authorize('update', $journalRecommendation->journal);

        $journalRecommendation->delete();

        return response()->json([
            'message' => 'Rekomendasi jurnal berhasil dihapus.',
        ]);
    }
}