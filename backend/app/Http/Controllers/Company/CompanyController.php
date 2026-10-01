<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $companies = Company::query()
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Data perusahaan berhasil diambil.',
            'data' => $companies,
        ]);
    }

    public function show(Company $company): JsonResponse
    {
        return response()->json([
            'message' => 'Data perusahaan berhasil diambil.',
            'data' => $company,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Perusahaan (data master partner) hanya dapat ditambahkan admin.
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'industry' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'student_quota' => ['required', 'integer', 'min:0'],
            'required_skills' => ['nullable', 'string'],
            'required_documents' => ['nullable', 'string'],
            'is_partner' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $company = Company::create($validated);

        return response()->json([
            'message' => 'Perusahaan berhasil ditambahkan.',
            'data' => $company,
        ], 201);
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        // Perubahan data perusahaan hanya oleh admin
        // (is_partner/is_active menentukan business rule pemilihan PKL).
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'industry' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'address' => ['sometimes', 'nullable', 'string'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'student_quota' => ['sometimes', 'integer', 'min:0'],
            'required_skills' => ['sometimes', 'nullable', 'string'],
            'required_documents' => ['sometimes', 'nullable', 'string'],
            'is_partner' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Perusahaan berhasil diperbarui.',
            'data' => $company->fresh(),
        ]);
    }

    public function destroy(Request $request, Company $company): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $company->delete();

        return response()->json([
            'message' => 'Perusahaan berhasil dihapus.',
        ]);
    }
}