<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CompanySupervisor;
use App\Models\Feedback;
use App\Models\PklPlacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FeedbackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Feedback::class);

        $validated = $request->validate([
            'placement_id' => [
                'sometimes',
                'integer',
                'exists:pkl_placements,id',
            ],
            'company_id' => [
                'sometimes',
                'integer',
                'exists:companies,id',
            ],
        ]);

        $query = Feedback::query()->with(['placement', 'company']);

        $user = $request->user();

        if ($user->role === 'student') {
            $query->where('student_id', $user->id);
        }

        // BR-19: perusahaan hanya melihat feedback yang sudah direview.
        if ($user->role === 'company') {
            $companyIds = CompanySupervisor::query()
                ->where('user_id', $user->id)
                ->pluck('company_id');

            $query->where('status', 'approved')
                ->whereIn('company_id', $companyIds);
        }

        if (isset($validated['placement_id'])) {
            $query->where('placement_id', $validated['placement_id']);
        }

        if (isset($validated['company_id'])) {
            $query->where('company_id', $validated['company_id']);
        }

        $feedbacks = $query->orderByDesc('created_at')->get();

        return response()->json([
            'message' => 'Data feedback berhasil diambil.',
            'data' => $feedbacks,
        ]);
    }

    public function show(Feedback $feedback): JsonResponse
    {
        Gate::authorize('view', $feedback);

        $feedback->load(['placement', 'company', 'reviewer']);

        return response()->json([
            'message' => 'Data feedback berhasil diambil.',
            'data' => $feedback,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Feedback::class);

        $validated = $request->validate([
            'placement_id' => [
                'required',
                'integer',
                'exists:pkl_placements,id',
            ],
            'lingkungan_kerja' => ['required', 'integer', 'between:1,5'],
            'pembimbing_industri' => ['required', 'integer', 'between:1,5'],
            'kesesuaian_bidang' => ['required', 'integer', 'between:1,5'],
            'pengalaman_belajar' => ['required', 'integer', 'between:1,5'],
            'kenyamanan' => ['required', 'integer', 'between:1,5'],
            'kesempatan_belajar' => ['required', 'integer', 'between:1,5'],
            'komentar' => ['nullable', 'string'],
        ]);

        $placement = PklPlacement::findOrFail($validated['placement_id']);

        // Feedback hanya untuk penempatan milik siswa yang sedang login.
        if ($placement->student_id !== $request->user()->id) {
            abort(403);
        }

        // PRD seksi 27: feedback diberikan setelah PKL selesai.
        if ($placement->status !== 'completed') {
            return response()->json([
                'message' => 'Feedback hanya dapat diberikan setelah PKL selesai.',
            ], 422);
        }

        if (Feedback::where('placement_id', $placement->id)->exists()) {
            return response()->json([
                'message' => 'Feedback untuk penempatan ini sudah pernah diberikan.',
            ], 422);
        }

        $feedback = Feedback::create([
            ...$validated,
            'student_id' => $request->user()->id,
            'company_id' => $placement->company_id,
            'status' => 'pending',
        ]);

        $feedback->load(['placement', 'company']);

        return response()->json([
            'message' => 'Feedback berhasil dikirim dan menunggu review sekolah.',
            'data' => $feedback,
        ], 201);
    }

    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        Gate::authorize('update', $feedback);

        $validated = $request->validate([
            'lingkungan_kerja' => ['sometimes', 'integer', 'between:1,5'],
            'pembimbing_industri' => ['sometimes', 'integer', 'between:1,5'],
            'kesesuaian_bidang' => ['sometimes', 'integer', 'between:1,5'],
            'pengalaman_belajar' => ['sometimes', 'integer', 'between:1,5'],
            'kenyamanan' => ['sometimes', 'integer', 'between:1,5'],
            'kesempatan_belajar' => ['sometimes', 'integer', 'between:1,5'],
            'komentar' => ['sometimes', 'nullable', 'string'],
        ]);

        $feedback->update($validated);

        $feedback->load(['placement', 'company']);

        return response()->json([
            'message' => 'Feedback berhasil diperbarui.',
            'data' => $feedback,
        ]);
    }

    public function destroy(Feedback $feedback): JsonResponse
    {
        Gate::authorize('delete', $feedback);

        $feedback->delete();

        return response()->json([
            'message' => 'Feedback berhasil dihapus.',
        ]);
    }

    /**
     * BR-19: sekolah mereview feedback sebelum dijadikan referensi.
     */
    public function review(Request $request, Feedback $feedback): JsonResponse
    {
        Gate::authorize('review', Feedback::class);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected'],
        ]);

        if ($feedback->status !== 'pending') {
            return response()->json([
                'message' => 'Feedback ini sudah pernah direview.',
            ], 422);
        }

        $feedback->update([
            'status' => $validated['status'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => $validated['status'] === 'approved'
                ? 'Feedback disetujui dan dapat dijadikan referensi.'
                : 'Feedback ditolak.',
            'data' => $feedback->fresh(['placement', 'company', 'reviewer']),
        ]);
    }
}
