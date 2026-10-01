<?php

namespace App\Policies;

use App\Models\ApplicationDocument;
use App\Models\User;

class ApplicationDocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'teacher',
            'student',
        ], true);
    }

    public function view(User $user, ApplicationDocument $document): bool
    {
        if (in_array($user->role, [
            'admin',
            'teacher',
        ], true)) {
            return true;
        }

        return $user->role === 'student'
            && $document->application
            && $document->application->student_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'student';
    }

    public function update(User $user, ApplicationDocument $document): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'student'
            && $document->application
            && $document->application->student_id === $user->id;
    }

    public function delete(User $user, ApplicationDocument $document): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'student'
            && $document->application
            && $document->application->student_id === $user->id;
    }

    public function restore(User $user, ApplicationDocument $document): bool
    {
        return false;
    }

    public function forceDelete(User $user, ApplicationDocument $document): bool
    {
        return false;
    }
}
