<?php

namespace App\Policies;

use App\Models\AssessmentComponent;
use App\Models\User;

class AssessmentComponentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'student', 'company'], true);
    }

    public function view(User $user, AssessmentComponent $assessmentComponent): bool
    {
        return in_array($user->role, ['admin', 'teacher', 'student', 'company'], true);
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, AssessmentComponent $assessmentComponent): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, AssessmentComponent $assessmentComponent): bool
    {
        return $user->role === 'admin';
    }
}
