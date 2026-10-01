<?php

namespace App\Policies;

use App\Models\Journal;
use App\Models\User;

class JournalPolicy
{
    /**
     * Admin dan Guru dapat melihat daftar jurnal.
     * Siswa hanya dapat melihat jurnal miliknya.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'teacher',
            'student',
        ], true);
    }

    /**
     * Menentukan apakah user boleh melihat jurnal tertentu.
     */
    public function view(User $user, Journal $journal): bool
    {
        if ($user->role === 'admin' || $user->role === 'teacher') {
            return true;
        }

        return $user->role === 'student'
            && $journal->placement
            && $journal->placement->student_id === $user->id;
    }

    /**
     * Siswa dapat membuat jurnal.
     */
    public function create(User $user): bool
    {
        return $user->role === 'student';
    }

    /**
     * Siswa hanya dapat mengubah jurnal miliknya.
     * Admin/Guru dapat mengelola jurnal.
     */
    public function update(User $user, Journal $journal): bool
    {
        if (in_array($user->role, [
            'admin',
            'teacher',
        ], true)) {
            return true;
        }

        return $user->role === 'student'
            && $journal->placement
            && $journal->placement->student_id === $user->id;
    }

    /**
     * Siswa hanya dapat menghapus jurnal miliknya.
     * Admin dapat menghapus jurnal.
     */
    public function delete(User $user, Journal $journal): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'student'
            && $journal->placement
            && $journal->placement->student_id === $user->id;
    }

    /**
     * Restore tidak digunakan untuk Journal saat ini.
     */
    public function restore(User $user, Journal $journal): bool
    {
        return false;
    }

    /**
     * Force delete tidak digunakan untuk Journal saat ini.
     */
    public function forceDelete(User $user, Journal $journal): bool
    {
        return false;
    }
}