<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Data sekolah berhasil diambil.',
            'data' => School::orderBy('name')->get(),
        ]);
    }

    public function show(School $school): JsonResponse
    {
        return response()->json([
            'message' => 'Data sekolah berhasil diambil.',
            'data' => $school,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'npsn' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $school = School::create($validated);

        return response()->json([
            'message' => 'Sekolah berhasil ditambahkan.',
            'data' => $school,
        ], 201);
    }

    public function update(Request $request, School $school): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'npsn' => ['sometimes', 'nullable', 'string', 'max:50'],
            'address' => ['sometimes', 'nullable', 'string'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $school->update($validated);

        return response()->json([
            'message' => 'Data sekolah berhasil diperbarui.',
            'data' => $school,
        ]);
    }

    public function destroy(Request $request, School $school): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $school->delete();

        return response()->json(['message' => 'Sekolah berhasil dihapus.']);
    }
}
