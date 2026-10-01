<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\PklPlacement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Attendance::class);

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

        $attendances = Attendance::query()
            ->where('placement_id', $validated['placement_id'])
            ->orderByDesc('attendance_date')
            ->get();

        return response()->json([
            'message' => 'Data absensi berhasil diambil.',
            'data' => $attendances,
        ]);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        Gate::authorize('view', $attendance);

        $attendance->load('placement');

        return response()->json([
            'message' => 'Data absensi berhasil diambil.',
            'data' => $attendance,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Attendance::class);

        $validated = $request->validate([
            'placement_id' => [
                'required',
                'integer',
                'exists:pkl_placements,id',
            ],
            'attendance_date' => [
                'required',
                'date',
            ],
            'check_in' => [
                'nullable',
                'date_format:H:i',
            ],
            'check_out' => [
                'nullable',
                'date_format:H:i',
                'after_or_equal:check_in',
            ],
            'status' => [
                'required',
                'string',
                'max:50',
                'in:present,absent,sick,permission',
            ],
            'note' => [
                'nullable',
                'string',
            ],
        ]);

        $placement = PklPlacement::findOrFail($validated['placement_id']);

        if (! Gate::forUser($request->user())->check('view', $placement)) {
            abort(403);
        }

        // Tanggal aktivitas absensi harus berada dalam periode PKL placement.
        $attendanceDate = strtotime((string) $validated['attendance_date']);

        if (
            $attendanceDate < strtotime((string) $placement->start_date)
            || $attendanceDate > strtotime((string) $placement->end_date)
        ) {
            return response()->json([
                'message' => 'Tanggal absensi harus berada dalam periode PKL penempatan.',
            ], 422);
        }

        $existingAttendance = Attendance::query()
            ->where('placement_id', $validated['placement_id'])
            ->where(
                'attendance_date',
                $validated['attendance_date']
            )
            ->exists();

        if ($existingAttendance) {
            return response()->json([
                'message' => 'Absensi untuk tanggal tersebut sudah tersedia.',
            ], 422);
        }

        $attendance = Attendance::create($validated);

        return response()->json([
            'message' => 'Absensi berhasil dicatat.',
            'data' => $attendance,
        ], 201);
    }

    public function update(
        Request $request,
        Attendance $attendance
    ): JsonResponse {
        Gate::authorize('update', $attendance);

        $validated = $request->validate([
            'attendance_date' => [
                'sometimes',
                'date',
            ],
            'check_in' => [
                'sometimes',
                'nullable',
                'date_format:H:i',
            ],
            'check_out' => [
                'sometimes',
                'nullable',
                'date_format:H:i',
            ],
            'status' => [
                'sometimes',
                'string',
                'max:50',
                'in:present,absent,sick,permission',
            ],
            'note' => [
                'sometimes',
                'nullable',
                'string',
            ],
        ]);

        if (isset($validated['attendance_date'])) {
            // Tanggal aktivitas absensi harus berada dalam periode PKL placement.
            $placement = $attendance->placement;
            $attendanceDate = strtotime((string) $validated['attendance_date']);

            if (
                $attendanceDate < strtotime((string) $placement->start_date)
                || $attendanceDate > strtotime((string) $placement->end_date)
            ) {
                return response()->json([
                    'message' => 'Tanggal absensi harus berada dalam periode PKL penempatan.',
                ], 422);
            }

            $duplicateAttendance = Attendance::query()
                ->where('placement_id', $attendance->placement_id)
                ->whereDate('attendance_date', $validated['attendance_date'])
                ->where('id', '!=', $attendance->id)
                ->exists();

            if ($duplicateAttendance) {
                return response()->json([
                    'message' => 'Absensi untuk tanggal tersebut sudah tersedia.',
                ], 422);
            }
        }

        // Validasi manual check_out >= check_in karena aturan after_or_equal:check_in
        // tidak bekerja saat hanya check_out yang dikirim pada update.
        $checkIn = $validated['check_in'] ?? $attendance->check_in;
        $checkOut = $validated['check_out'] ?? $attendance->check_out;

        if ($checkIn && $checkOut && strcmp((string) $checkOut, (string) $checkIn) < 0) {
            return response()->json([
                'message' => 'Jam pulang tidak boleh lebih awal dari jam masuk.',
            ], 422);
        }

        $attendance->update($validated);

        return response()->json([
            'message' => 'Data absensi berhasil diperbarui.',
            'data' => $attendance->fresh(),
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        Gate::authorize('delete', $attendance);

        $attendance->delete();

        return response()->json([
            'message' => 'Data absensi berhasil dihapus.',
        ]);
    }
}