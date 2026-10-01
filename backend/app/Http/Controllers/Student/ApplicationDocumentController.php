<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ApplicationDocument;
use App\Models\PklApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ApplicationDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'application_id' => ['required', 'integer', 'exists:pkl_applications,id'],
        ]);

        $application = PklApplication::findOrFail($validated['application_id']);

        if (! Gate::forUser($request->user())->check('view', $application)) {
            abort(403);
        }

        $documents = ApplicationDocument::query()
            ->where('application_id', $validated['application_id'])
            ->orderBy('id')
            ->get();

        return response()->json([
            'message' => 'Dokumen pendaftaran berhasil diambil.',
            'data' => $documents,
        ]);
    }

    public function show(ApplicationDocument $applicationDocument): JsonResponse
    {
        Gate::authorize('view', $applicationDocument);

        $applicationDocument->load('application');

        return response()->json([
            'message' => 'Dokumen pendaftaran berhasil diambil.',
            'data' => $applicationDocument,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'application_id' => ['required', 'integer', 'exists:pkl_applications,id'],
            'document_type' => ['required', 'string', 'max:100'],
            'document_name' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:5120'],
            'document_type' => ['required', 'string', 'max:100', 'in:ktp,ijazah,skck,surat_rekomendasi,others'],
        ]);

        $application = PklApplication::findOrFail($validated['application_id']);

        if (! Gate::forUser($request->user())->check('update', $application)) {
            abort(403);
        }

        $filePath = $request->file('file')->store(
            'application-documents',
            'public'
        );

        $document = ApplicationDocument::create([
            'application_id' => $validated['application_id'],
            'document_type' => $validated['document_type'],
            'document_name' => $validated['document_name'],
            'file_path' => $filePath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Dokumen berhasil diunggah.',
            'data' => $document,
        ], 201);
    }

    public function update(
        Request $request,
        ApplicationDocument $applicationDocument
    ): JsonResponse {
        Gate::authorize('update', $applicationDocument);

        $validated = $request->validate([
            'document_type' => ['sometimes', 'string', 'max:100', 'in:ktp,ijazah,skck,surat_rekomendasi,others'],
            'document_name' => ['sometimes', 'string', 'max:255'],
            'file' => ['sometimes', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:5120'],
        ]);

        if ($request->hasFile('file')) {
            if (
                $applicationDocument->file_path &&
                Storage::disk('public')->exists($applicationDocument->file_path)
            ) {
                Storage::disk('public')->delete(
                    $applicationDocument->file_path
                );
            }

            $validated['file_path'] = $request->file('file')->store(
                'application-documents',
                'public'
            );
        }

        unset($validated['file']);

        $applicationDocument->update($validated);

        return response()->json([
            'message' => 'Dokumen berhasil diperbarui.',
            'data' => $applicationDocument->fresh(),
        ]);
    }

    public function destroy(
        ApplicationDocument $applicationDocument
    ): JsonResponse {
        Gate::authorize('delete', $applicationDocument);

        if (
            $applicationDocument->file_path &&
            Storage::disk('public')->exists($applicationDocument->file_path)
        ) {
            Storage::disk('public')->delete(
                $applicationDocument->file_path
            );
        }

        $applicationDocument->delete();

        return response()->json([
            'message' => 'Dokumen berhasil dihapus.',
        ]);
    }
}