<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\ManagesPklTestData;
use Tests\TestCase;

class AttendancePolicyTest extends TestCase
{
    use RefreshDatabase;
    use ManagesPklTestData;

    public function test_student_can_view_attendance_of_own_placement(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);
        $attendance = $this->createAttendance($placement);

        Sanctum::actingAs($student);

        $this->getJson("/api/attendances/{$attendance->id}")
            ->assertOk();
    }

    public function test_student_cannot_view_attendance_of_other_student(): void
    {
        $studentA = $this->createUser('student', 'student_a');
        $studentB = $this->createUser('student', 'student_b');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placementB = $this->createPlacement($studentB, $company, $period);
        $attendance = $this->createAttendance($placementB);

        Sanctum::actingAs($studentA);

        $this->getJson("/api/attendances/{$attendance->id}")
            ->assertForbidden();
    }

    public function test_student_cannot_list_attendance_of_other_placement(): void
    {
        $studentA = $this->createUser('student', 'student_a');
        $studentB = $this->createUser('student', 'student_b');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placementB = $this->createPlacement($studentB, $company, $period);
        $this->createAttendance($placementB);

        Sanctum::actingAs($studentA);

        $this->getJson('/api/attendances?placement_id='.$placementB->id)
            ->assertForbidden();
    }

    public function test_student_can_create_attendance_for_own_placement(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);

        Sanctum::actingAs($student);

        $this->postJson('/api/attendances', [
            'placement_id' => $placement->id,
            'attendance_date' => now()->addDay()->toDateString(),
            'check_in' => '08:00',
            'check_out' => '16:00',
            'status' => 'present',
        ])->assertCreated();
    }

    public function test_student_cannot_create_attendance_for_other_placement(): void
    {
        $studentA = $this->createUser('student', 'student_a');
        $studentB = $this->createUser('student', 'student_b');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placementB = $this->createPlacement($studentB, $company, $period);

        Sanctum::actingAs($studentA);

        $this->postJson('/api/attendances', [
            'placement_id' => $placementB->id,
            'attendance_date' => now()->addDay()->toDateString(),
            'status' => 'present',
        ])->assertForbidden();
    }

    public function test_company_can_view_attendance_at_its_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);
        $attendance = $this->createAttendance($placement);

        $companyUser = $this->createUser('company', 'company_a');
        $this->attachCompanySupervisor($companyUser, $company);

        Sanctum::actingAs($companyUser);

        $this->getJson("/api/attendances/{$attendance->id}")
            ->assertOk();
    }

    public function test_company_cannot_view_attendance_of_other_company(): void
    {
        $student = $this->createUser('student', 'student_a');
        $company = $this->createCompany();
        $otherCompany = $this->createCompany('PT Lain');
        $period = $this->createPeriod();
        $placement = $this->createPlacement($student, $company, $period);
        $attendance = $this->createAttendance($placement);

        $companyUser = $this->createUser('company', 'company_other');
        $this->attachCompanySupervisor($companyUser, $otherCompany);

        Sanctum::actingAs($companyUser);

        $this->getJson("/api/attendances/{$attendance->id}")
            ->assertForbidden();
    }

    public function test_student_cannot_delete_attendance_of_other_student(): void
    {
        $studentA = $this->createUser('student', 'student_a');
        $studentB = $this->createUser('student', 'student_b');
        $company = $this->createCompany();
        $period = $this->createPeriod();
        $placementB = $this->createPlacement($studentB, $company, $period);
        $attendance = $this->createAttendance($placementB);

        Sanctum::actingAs($studentA);

        $this->deleteJson("/api/attendances/{$attendance->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
        ]);
    }
}
