<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TeacherProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Hanya admin/guru yang dapat menelusuri seluruh profil guru.
        if (! in_array($request->user()->role, ['admin', 'teacher'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ]);

        $query = TeacherProfile::query()
            ->with('user')
            ->orderBy('id');

        if (isset($validated['user_id'])) {
            $query->where('user_id', $validated['user_id']);
        }

        return response()->json([
            'message' => 'Data profil guru berhasil diambil.',
            'data' => $query->get(),
        ]);
    }

    public function show(TeacherProfile $teacherProfile): JsonResponse
    {
        $user = request()->user();

        // Guru hanya dapat melihat profil miliknya sendiri.
        if (
            $user->role === 'teacher'
            && $teacherProfile->user_id !== $user->id
        ) {
            abort(403);
        }

        $teacherProfile->load('user');

        return response()->json([
            'message' => 'Data profil guru berhasil diambil.',
            'data' => $teacherProfile,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Hanya admin yang dapat membuat profil guru;
        // guru hanya boleh membuat profil miliknya sendiri.
        $isSelfCreation =
            $request->user()->role === 'teacher'
            && (int) $request->input('user_id') === $request->user()->id;

        if ($request->user()->role !== 'admin' && ! $isSelfCreation) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                'unique:teacher_profiles,user_id',
            ],
            'nip' => [
                'required',
                'string',
                'max:50',
                'unique:teacher_profiles,nip',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],
            'subject' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $existingProfile = TeacherProfile::query()
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($existingProfile) {
            return response()->json([
                'message' => 'Profil guru untuk pengguna tersebut sudah tersedia.',
            ], 422);
        }

        $profile = TeacherProfile::create($validated);

        $profile->load('user');

        return response()->json([
            'message' => 'Profil guru berhasil dibuat.',
            'data' => $profile,
        ], 201);
    }

    public function update(
        Request $request,
        TeacherProfile $teacherProfile
    ): JsonResponse {
        // Guru hanya dapat memperbarui profil miliknya sendiri.
        if (
            $request->user()->role === 'teacher'
            && $teacherProfile->user_id !== $request->user()->id
        ) {
            abort(403);
        }

        if (! in_array($request->user()->role, ['admin', 'teacher'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'nip' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('teacher_profiles', 'nip')
                    ->ignore($teacherProfile->id),
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:30',
            ],
            'subject' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $teacherProfile->update($validated);

        $teacherProfile->load('user');

        return response()->json([
            'message' => 'Profil guru berhasil diperbarui.',
            'data' => $teacherProfile,
        ]);
    }

    public function destroy(Request $request, TeacherProfile $teacherProfile): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $teacherProfile->delete();

        return response()->json([
            'message' => 'Profil guru berhasil dihapus.',
        ]);
    }
}