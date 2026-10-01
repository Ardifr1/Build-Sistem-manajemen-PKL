<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\ManagesPklTestData;
use Tests\TestCase;

class ApplicationReviewPolicyTest extends TestCase
{
    use RefreshDatabase;
    use ManagesPklTestData;

    public function test_company_can_create_review_for_application_to_its_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $application = $this->makeApplicationFor($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);

        Sanctum::actingAs($companyUser);

        $this->postJson('/api/application-reviews', [
            'application_id' => $application->id,
            'status' => 'approved',
            'note' => 'Diterima.',
        ])->assertCreated();
    }

    public function test_company_cannot_review_application_of_other_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $otherCompany = $this->createCompany('PT Lain');
        $period = $this->createPeriod();
        $application = $this->makeApplicationFor($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_other');
        $this->attachCompanySupervisor($companyUser, $otherCompany);

        Sanctum::actingAs($companyUser);

        $this->postJson('/api/application-reviews', [
            'application_id' => $application->id,
            'status' => 'approved',
        ])->assertForbidden();
    }

    public function test_student_cannot_create_review(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $this->makeApplicationFor($student, $company, $period);

        Sanctum::actingAs($student);

        $this->postJson('/api/application-reviews', [
            'application_id' => 1,
            'status' => 'approved',
        ])->assertForbidden();
    }

    public function test_student_can_view_review_of_own_application(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $application = $this->makeApplicationFor($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);
        $review = $this->createReview($application, $companyUser);

        Sanctum::actingAs($student);

        $this->getJson("/api/application-reviews/{$review->id}")
            ->assertOk();
    }

    public function test_student_cannot_view_review_of_other_student_application(): void
    {
        $studentA = $this->createUser('student', 'student_a');
        $studentB = $this->createUser('student', 'student_b');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $applicationB = $this->makeApplicationFor($studentB, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);
        $review = $this->createReview($applicationB, $companyUser);

        Sanctum::actingAs($studentA);

        $this->getJson("/api/application-reviews/{$review->id}")
            ->assertForbidden();
    }

    public function test_other_company_cannot_view_review(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $otherCompany = $this->createCompany('PT Lain');
        $period = $this->createPeriod();
        $application = $this->makeApplicationFor($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);
        $review = $this->createReview($application, $companyUser);

        $companyOtherUser = $this->createUser('company', 'company_other');
        $this->attachCompanySupervisor($companyOtherUser, $otherCompany);

        Sanctum::actingAs($companyOtherUser);

        $this->getJson("/api/application-reviews/{$review->id}")
            ->assertForbidden();
    }

    public function test_other_reviewer_cannot_update_review(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $application = $this->makeApplicationFor($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);
        $review = $this->createReview($application, $companyUser);

        $otherCompanyUser = $this->createUser('company', 'company_b');
        $this->attachCompanySupervisor($otherCompanyUser, $company);

        Sanctum::actingAs($otherCompanyUser);

        $this->putJson("/api/application-reviews/{$review->id}", [
            'status' => 'rejected',
        ])->assertForbidden();
    }

    public function test_reviewer_can_update_own_review(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $application = $this->makeApplicationFor($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);
        $review = $this->createReview($application, $companyUser);

        Sanctum::actingAs($companyUser);

        $this->putJson("/api/application-reviews/{$review->id}", [
            'status' => 'rejected',
            'note' => 'Ditolak setelah koreksi.',
        ])->assertOk();
    }
}
