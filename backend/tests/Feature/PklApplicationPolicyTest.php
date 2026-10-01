<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\PklApplication;
use App\Models\PklPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PklApplicationPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_view_own_application(): void
    {
        $student = $this->createStudent('student_a', 'Siswa A');

        $application = $this->makeApplication($student);

        Sanctum::actingAs($student);

        $response = $this->getJson(
            "/api/pkl-applications/{$application->id}"
        );

        $response->assertOk();
    }

    public function test_student_cannot_view_other_student_application(): void
    {
        $studentA = $this->createStudent('student_a', 'Siswa A');
        $studentB = $this->createStudent('student_b', 'Siswa B');

        $application = $this->makeApplication($studentB);

        Sanctum::actingAs($studentA);

        $response = $this->getJson(
            "/api/pkl-applications/{$application->id}"
        );

        $response->assertForbidden();
    }

    public function test_student_cannot_list_application_of_other_student(): void
    {
        $studentA = $this->createStudent('student_a', 'Siswa A');
        $studentB = $this->createStudent('student_b', 'Siswa B');

        $application = $this->makeApplication($studentB);

        Sanctum::actingAs($studentA);

        $this->getJson('/api/pkl-applications?student_id='.$studentB->id)
            ->assertForbidden();
    }

    public function test_student_cannot_store_application_for_other_student(): void
    {
        $studentA = $this->createStudent('student_a', 'Siswa A');
        $studentB = $this->createStudent('student_b', 'Siswa B');

        $company = \App\Models\Company::create([
            'name' => 'PT Test Company',
            'industry' => 'Teknologi',
            'student_quota' => 5,
            'is_partner' => true,
            'is_active' => true,
        ]);

        $period = \App\Models\PklPeriod::create([
            'name' => 'PKL Test 2026',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addMonths(3)->toDateString(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($studentA);

        $this->postJson('/api/pkl-applications', [
            'student_id' => $studentB->id,
            'company_id' => $company->id,
            'pkl_period_id' => $period->id,
            'choice_order' => 1,
        ])->assertForbidden();
    }

    public function test_student_can_update_own_pending_application(): void
    {
        $student = $this->createStudent('student_a', 'Siswa A');

        $application = $this->makeApplication($student);

        Sanctum::actingAs($student);

        $this->putJson("/api/pkl-applications/{$application->id}", [
            'student_note' => 'Ubah catatan.',
        ])->assertOk();
    }

    public function test_student_cannot_update_application_of_other_student(): void
    {
        $studentA = $this->createStudent('student_a', 'Siswa A');
        $studentB = $this->createStudent('student_b', 'Siswa B');

        $application = $this->makeApplication($studentB);

        Sanctum::actingAs($studentA);

        $this->putJson("/api/pkl-applications/{$application->id}", [
            'student_note' => 'Diubah tanpa hak.',
        ])->assertForbidden();

        $this->assertDatabaseHas('pkl_applications', [
            'id' => $application->id,
            'student_note' => null,
        ]);
    }

    public function test_student_cannot_delete_application_of_other_student(): void
    {
        $studentA = $this->createStudent('student_a', 'Siswa A');
        $studentB = $this->createStudent('student_b', 'Siswa B');

        $application = $this->makeApplication($studentB);

        Sanctum::actingAs($studentA);

        $this->deleteJson("/api/pkl-applications/{$application->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('pkl_applications', [
            'id' => $application->id,
        ]);
    }

    public function test_student_can_delete_own_pending_application(): void
    {
        $student = $this->createStudent('student_a', 'Siswa A');

        $application = $this->makeApplication($student);

        Sanctum::actingAs($student);

        $this->deleteJson("/api/pkl-applications/{$application->id}")
            ->assertOk();

        $this->assertDatabaseMissing('pkl_applications', [
            'id' => $application->id,
        ]);
    }

    private function createStudent(string $username, string $name): User
    {
        return User::create([
            'name' => $name,
            'username' => $username,
            'email' => "{$username}@test.com",
            'password' => Hash::make('password123'),
            'role' => 'student',
            'is_active' => true,
        ]);
    }

    private function makeApplication(User $student): PklApplication
    {
        $company = Company::create([
            'name' => 'PT Test Company',
            'industry' => 'Teknologi',
            'student_quota' => 5,
            'is_partner' => true,
            'is_active' => true,
        ]);

        $period = PklPeriod::create([
            'name' => 'PKL Test 2026',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addMonths(3)->toDateString(),
            'is_active' => true,
        ]);

        return PklApplication::create([
            'student_id' => $student->id,
            'company_id' => $company->id,
            'pkl_period_id' => $period->id,
            'choice_order' => 1,
            'status' => 'pending',
        ]);
    }
}