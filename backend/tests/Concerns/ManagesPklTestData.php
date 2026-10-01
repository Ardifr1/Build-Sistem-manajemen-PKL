<?php

namespace Tests\Concerns;

use App\Models\ApplicationDocument;
use App\Models\ApplicationReview;
use App\Models\Assessment;
use App\Models\AssessmentComponent;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\CompanySupervisor;
use App\Models\FinalAssessment;
use App\Models\Journal;
use App\Models\PklApplication;
use App\Models\PklPeriod;
use App\Models\PklPlacement;
use App\Models\ProgressRecord;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

trait ManagesPklTestData
{
    protected function createUser(string $role, string $username): User
    {
        return User::create([
            'name' => ucfirst($username),
            'username' => $username,
            'email' => "{$username}@test.com",
            'password' => Hash::make('password123'),
            'role' => $role,
            'is_active' => true,
        ]);
    }

    protected function createCompany(string $name = 'PT Test Company'): Company
    {
        return Company::create([
            'name' => $name,
            'industry' => 'Teknologi',
            'student_quota' => 5,
            'is_partner' => true,
            'is_active' => true,
        ]);
    }

    protected function attachCompanySupervisor(User $user, Company $company): CompanySupervisor
    {
        return CompanySupervisor::create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'position' => 'Pembimbing',
        ]);
    }

    protected function createPeriod(string $name = 'PKL Test 2026'): PklPeriod
    {
        return PklPeriod::create([
            'name' => $name,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addMonths(3)->toDateString(),
            'is_active' => true,
        ]);
    }

    protected function makeApplicationFor(
        User $student,
        Company $company,
        PklPeriod $period,
        int $choiceOrder = 1
    ): PklApplication {
        return PklApplication::create([
            'student_id' => $student->id,
            'company_id' => $company->id,
            'pkl_period_id' => $period->id,
            'choice_order' => $choiceOrder,
            'status' => 'pending',
        ]);
    }

    protected function createPlacement(
        User $student,
        Company $company,
        PklPeriod $period,
        ?PklApplication $application = null
    ): PklPlacement {
        return PklPlacement::create([
            'student_id' => $student->id,
            'company_id' => $company->id,
            'pkl_period_id' => $period->id,
            'application_id' => $application?->id,
            'start_date' => $period->start_date,
            'end_date' => $period->end_date,
            'status' => 'active',
        ]);
    }

    protected function createJournal(PklPlacement $placement): Journal
    {
        return Journal::create([
            'placement_id' => $placement->id,
            'journal_date' => now()->toDateString(),
            'activity' => 'Mengerjakan testing aplikasi',
            'status' => 'draft',
        ]);
    }

    protected function createDocument(PklApplication $application): ApplicationDocument
    {
        return ApplicationDocument::create([
            'application_id' => $application->id,
            'document_type' => 'ktp',
            'document_name' => 'KTP',
            'file_path' => 'application-documents/ktp-'.$application->id.'.pdf',
            'status' => 'pending',
        ]);
    }

    protected function createReview(PklApplication $application, User $reviewer): ApplicationReview
    {
        return ApplicationReview::create([
            'application_id' => $application->id,
            'reviewer_id' => $reviewer->id,
            'reviewer_role' => $reviewer->role,
            'status' => 'approved',
            'note' => 'Review otomatis untuk test.',
            'reviewed_at' => now(),
        ]);
    }

    protected function createComponent(): AssessmentComponent
    {
        return AssessmentComponent::create([
            'name' => 'Kedisiplinan',
            'weight' => 40,
            'is_active' => true,
        ]);
    }

    protected function createAssessment(
        PklPlacement $placement,
        AssessmentComponent $component,
        User $assessor
    ): Assessment {
        return Assessment::create([
            'placement_id' => $placement->id,
            'component_id' => $component->id,
            'assessed_by' => $assessor->id,
            'assessor_role' => $assessor->role,
            'score' => 85,
            'note' => null,
        ]);
    }

    protected function createAttendance(PklPlacement $placement): Attendance
    {
        return Attendance::create([
            'placement_id' => $placement->id,
            'attendance_date' => now()->toDateString(),
            'check_in' => '08:00',
            'check_out' => '16:00',
            'status' => 'present',
        ]);
    }

    protected function createProgressRecord(PklPlacement $placement, User $recorder): ProgressRecord
    {
        return ProgressRecord::create([
            'placement_id' => $placement->id,
            'recorded_by' => $recorder->id,
            'recorded_by_role' => $recorder->role,
            'development' => 'Perkembangan baik.',
            'recorded_date' => now()->toDateString(),
        ]);
    }

    protected function createFinalAssessment(PklPlacement $placement, User $finalizer): FinalAssessment
    {
        return FinalAssessment::create([
            'placement_id' => $placement->id,
            'final_score' => 88,
            'status' => 'draft',
            'finalized_by' => $finalizer->id,
            'finalized_at' => now(),
        ]);
    }
}
