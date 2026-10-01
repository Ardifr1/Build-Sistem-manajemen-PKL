<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\ManagesPklTestData;
use Tests\TestCase;

class FinalAssessmentPolicyTest extends TestCase
{
    use RefreshDatabase;
    use ManagesPklTestData;

    public function test_teacher_can_create_final_assessment(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);

        $teacher = $this->createUser('teacher', 'teacher_a');

        Sanctum::actingAs($teacher);

        $this->postJson('/api/final-assessments', [
            'placement_id' => $placement->id,
            'final_score' => 88,
            'status' => 'draft',
        ])->assertCreated();
    }

    public function test_student_cannot_create_final_assessment(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $this->createPlacement($student, $company, $period);

        Sanctum::actingAs($student);

        $this->postJson('/api/final-assessments', [
            'placement_id' => 1,
            'final_score' => 88,
            'status' => 'draft',
        ])->assertForbidden();
    }

    public function test_company_cannot_create_final_assessment(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $this->createPlacement($student, $company, $period);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);

        Sanctum::actingAs($companyUser);

        $this->postJson('/api/final-assessments', [
            'placement_id' => 1,
            'final_score' => 88,
            'status' => 'draft',
        ])->assertForbidden();
    }

    public function test_teacher_cannot_finalize_for_placement_of_other_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $otherCompany = $this->createCompany('PT Lain');
        $period = $this->createPeriod();
        $placementOther = $this->createPlacement($student, $company, $period);

        // Placement milik perusahaan lain tidak boleh dinilai akhir oleh
        // company user dari perusahaan berbeda (guest teacher path).
        $companyUser = $this->createUser('company', 'company_other');
        $this->attachCompanySupervisor($companyUser, $otherCompany);

        Sanctum::actingAs($companyUser);

        $this->postJson('/api/final-assessments', [
            'placement_id' => $placementOther->id,
            'final_score' => 70,
            'status' => 'draft',
        ])->assertForbidden();
    }

    public function test_student_can_view_own_final_assessment(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);

        $teacher = $this->createUser('teacher', 'teacher_a');
        $finalAssessment = $this->createFinalAssessment($placement, $teacher);

        Sanctum::actingAs($student);

        $this->getJson("/api/final-assessments/{$finalAssessment->id}")
            ->assertOk();
    }

    public function test_student_cannot_view_final_assessment_of_other_student(): void
    {
        $studentA = $this->createUser('student', 'student_a');
        $studentB = $this->createUser('student', 'student_b');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placementB = $this->createPlacement($studentB, $company, $period);

        $teacher = $this->createUser('teacher', 'teacher_a');
        $finalAssessment = $this->createFinalAssessment($placementB, $teacher);

        Sanctum::actingAs($studentA);

        $this->getJson("/api/final-assessments/{$finalAssessment->id}")
            ->assertForbidden();
    }

    public function test_company_can_view_final_assessment_at_its_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);

        $teacher = $this->createUser('teacher', 'teacher_a');
        $finalAssessment = $this->createFinalAssessment($placement, $teacher);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);

        Sanctum::actingAs($companyUser);

        $this->getJson("/api/final-assessments/{$finalAssessment->id}")
            ->assertOk();
    }

    public function test_company_cannot_view_final_assessment_of_other_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $otherCompany = $this->createCompany('PT Lain');
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);

        $teacher = $this->createUser('teacher', 'teacher_a');
        $finalAssessment = $this->createFinalAssessment($placement, $teacher);

        $companyUser = $this->createUser('company', 'company_other');
        $this->attachCompanySupervisor($companyUser, $otherCompany);

        Sanctum::actingAs($companyUser);

        $this->getJson("/api/final-assessments/{$finalAssessment->id}")
            ->assertForbidden();
    }

    public function test_student_cannot_update_final_assessment(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);

        $teacher = $this->createUser('teacher', 'teacher_a');
        $finalAssessment = $this->createFinalAssessment($placement, $teacher);

        Sanctum::actingAs($student);

        $this->putJson("/api/final-assessments/{$finalAssessment->id}", [
            'final_score' => 100,
        ])->assertForbidden();

        $this->assertDatabaseHas('final_assessments', [
            'id' => $finalAssessment->id,
            'final_score' => '88.00',
        ]);
    }
}
