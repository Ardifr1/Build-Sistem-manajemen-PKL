<?php

namespace App\Policies;

use App\Models\Feedback;
use App\Models\User;
use App\Policies\Concerns\ResolvesCompanyAccess;

class FeedbackPolicy
{
    use ResolvesCompanyAccess;

    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'student', 'company'], true);
    }

    public function view(User $user, Feedback $feedback): bool
    {
        if (in_array($user->role, ['admin', 'teacher'], true)) {
            return true;
        }

        if ($user->role === 'student') {
            return $feedback->student_id === $user->id;
        }

        // BR-19: perusahaan hanya boleh melihat feedback yang sudah
        // direview sekolah (approved) dan ditujukan ke perusahaannya.
        if ($user->role === 'company') {
            return $feedback->status === 'approved'
                && $this->isAuthorizedForCompany($user, $feedback->company_id);
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'student';
    }

    public function update(User $user, Feedback $feedback): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        // Siswa hanya boleh mengubah feedback miliknya yang belum direview.
        if ($user->role === 'student') {
            return $feedback->student_id === $user->id
                && $feedback->status === 'pending';
        }

        return false;
    }

    public function delete(User $user, Feedback $feedback): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'student') {
            return $feedback->student_id === $user->id
                && $feedback->status === 'pending';
        }

        return false;
    }

    public function review(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher'], true);
    }
}
