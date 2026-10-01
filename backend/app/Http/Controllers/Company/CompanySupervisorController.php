<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\CompanySupervisor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class CompanySupervisorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Hanya admin yang dapat melihat seluruh pembimbing industri.
        if ($user->role !== 'admin') {
            abort(403);
        }

        $supervisors = CompanySupervisor::with(['user', 'company'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'message' => 'Data pembimbing industri berhasil diambil.',
            'data' => $supervisors,
        ]);
    }

    public function show(CompanySupervisor $companySupervisor): JsonResponse
    {
        $user = request()->user();

        // Company hanya dapat melihat penugasan yang terkait dengannya;
        // selain itu hanya admin.
        if (
            $user->role !== 'admin'
            && ! ($user->role === 'company'
                && ($companySupervisor->user_id === $user->id
                    || $this->isAuthorizedForCompany($user, $companySupervisor->company_id)))
        ) {
            abort(403);
        }

        $companySupervisor->load(['user', 'company']);

        return response()->json([
            'message' => 'Data pembimbing industri berhasil diambil.',
            'data' => $companySupervisor,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Penugasan pembimbing industri hanya dilakukan admin.
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id', 'unique:company_supervisors,user_id'],
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'position' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $supervisor = CompanySupervisor::create($validated);

        $supervisor->load(['user', 'company']);

        return response()->json([
            'message' => 'Pembimbing industri berhasil ditambahkan.',
            'data' => $supervisor,
        ], 201);
    }

    public function update(
        Request $request,
        CompanySupervisor $companySupervisor
    ): JsonResponse {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => ['sometimes', 'integer', 'exists:users,id', Rule::unique('company_supervisors', 'user_id')->ignore($companySupervisor->id)],
            'company_id' => ['sometimes', 'integer', 'exists:companies,id'],
            'position' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
        ]);

        $companySupervisor->update($validated);

        $companySupervisor->load(['user', 'company']);

        return response()->json([
            'message' => 'Data pembimbing industri berhasil diperbarui.',
            'data' => $companySupervisor,
        ]);
    }

    public function destroy(
        CompanySupervisor $companySupervisor
    ): JsonResponse {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }
        
        $companySupervisor->delete();

        return response()->json([
            'message' => 'Pembimbing industri berhasil dihapus.',
        ]);
    }
}