<?php

namespace App\Policies;

use App\Models\ProgressRecord;
use App\Models\User;
use App\Policies\Concerns\ResolvesCompanyAccess;

class ProgressRecordPolicy
{
    use ResolvesCompanyAccess;

    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'student'], true);
    }

    public function view(User $user, ProgressRecord $progressRecord): bool
    {
        if (in_array($user->role, ['admin', 'teacher'], true)) {
            return true;
        }

        if ($user->role === 'student') {
            return $progressRecord->placement
                && $progressRecord->placement->student_id === $user->id;
        }

        if ($user->role === 'company') {
            return $progressRecord->placement
                && $this->isAuthorizedForCompany($user, $progressRecord->placement->company_id);
        }

        return false;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['teacher', 'company'], true);
    }

    public function update(User $user, ProgressRecord $progressRecord): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        // Hanya pencatat aslinya yang boleh mengubah catatan perkembangan.
        if (in_array($user->role, ['teacher', 'company'], true)) {
            return $progressRecord->recorded_by === $user->id;
        }

        return false;
    }

    public function delete(User $user, ProgressRecord $progressRecord): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if (in_array($user->role, ['teacher', 'company'], true)) {
            return $progressRecord->recorded_by === $user->id;
        }

        return false;
    }
}
