<?php

namespace App\Policies;

use App\Models\PklPeriod;
use App\Models\User;

class PklPeriodPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'student', 'company'], true);
    }

    public function view(User $user, PklPeriod $pklPeriod): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'student', 'company'], true);
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, PklPeriod $pklPeriod): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, PklPeriod $pklPeriod): bool
    {
        return $user->role === 'admin';
    }
}
