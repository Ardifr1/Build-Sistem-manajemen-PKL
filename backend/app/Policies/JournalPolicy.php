<?php

namespace App\Policies;

use App\Models\Journal;
use App\Models\User;

class JournalPolicy
{
    /**
     * Admin dan Guru dapat melihat daftar jurnal.
     * Siswa hanya dapat melihat jurnal miliknya.
     * Industri dapat melihat jurnal penempatan di perusahaannya.
     */
    public function viewAny(User $user): bool
    {
        if (in_array($user->role, [
            'admin',
            'teacher',
            'student',
        ], true)) {
            return true;
        }

        if ($user->role === 'company' && $user->companySupervisor !== null) {
            return true;
        }

        return $user->role === 'supervisor'
            && $user->companySupervisor !== null;
    }

    /**
     * Menentukan apakah user boleh melihat jurnal tertentu.
     */
    public function view(User $user, Journal $journal): bool
    {
        if ($user->role === 'admin' || $user->role === 'teacher') {
            return true;
        }

        if ($user->role === 'company') {
            return $journal->placement
                && $user->companySupervisor
                && $journal->placement->company_id === $user->companySupervisor->company_id;
        }

        if ($user->role === 'supervisor') {
            return $journal->placement
                && $user->companySupervisor
                && $journal->placement->supervisor_id === $user->companySupervisor->id;
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