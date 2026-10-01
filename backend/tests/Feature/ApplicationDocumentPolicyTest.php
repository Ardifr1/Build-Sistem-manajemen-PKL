<?php

namespace Tests\Feature;

use App\Models\ApplicationDocument;
use App\Models\Company;
use App\Models\PklApplication;
use App\Models\PklPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApplicationDocumentPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_view_own_document(): void
    {
        $student = $this->createStudent('doc_student_a', 'Siswa A');

        $document = $this->makeDocumentForStudent($student);

        Sanctum::actingAs($student);

        $response = $this->getJson("/api/application-documents/{$document->id}");

        $response->assertOk();
    }

    public function test_student_cannot_view_other_student_document(): void
    {
        $studentA = $this->createStudent('doc_student_a', 'Siswa A');
        $studentB = $this->createStudent('doc_student_b', 'Siswa B');

        $document = $this->makeDocumentForStudent($studentB);

        Sanctum::actingAs($studentA);

        $response = $this->getJson("/api/application-documents/{$document->id}");

        $response->assertForbidden();
    }

    public function test_student_cannot_list_document_of_other_application(): void
    {
        $studentA = $this->createStudent('doc_student_a', 'Siswa A');
        $studentB = $this->createStudent('doc_student_b', 'Siswa B');

        $document = $this->makeDocumentForStudent($studentB);

        Sanctum::actingAs($studentA);

        $this->getJson('/api/application-documents?application_id='.$document->application_id)
            ->assertForbidden();
    }

    public function test_student_cannot_store_document_for_other_application(): void
    {
        $studentA = $this->createStudent('doc_student_a', 'Siswa A');
        $studentB = $this->createStudent('doc_student_b', 'Siswa B');

        $document = $this->makeDocumentForStudent($studentB);

        Sanctum::actingAs($studentA);

        $this->postJson('/api/application-documents', [
            'application_id' => $document->application_id,
            'document_type' => 'ijazah',
            'document_name' => 'Ijazah.pdf',
            'file' => \Illuminate\Http\UploadedFile::fake()->create('ijazah.pdf', 100, 'application/pdf'),
        ])->assertForbidden();
    }

    public function test_student_cannot_update_document_of_other_student(): void
    {
        $studentA = $this->createStudent('doc_student_a', 'Siswa A');
        $studentB = $this->createStudent('doc_student_b', 'Siswa B');

        $document = $this->makeDocumentForStudent($studentB);

        Sanctum::actingAs($studentA);

        $this->putJson("/api/application-documents/{$document->id}", [
            'document_name' => 'Diubah tanpa hak.pdf',
        ])->assertForbidden();
    }

    public function test_student_cannot_delete_document_of_other_student(): void
    {
        $studentA = $this->createStudent('doc_student_a', 'Siswa A');
        $studentB = $this->createStudent('doc_student_b', 'Siswa B');

        $document = $this->makeDocumentForStudent($studentB);

        Sanctum::actingAs($studentA);

        $this->deleteJson("/api/application-documents/{$document->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('application_documents', [
            'id' => $document->id,
        ]);
    }

    public function test_student_can_delete_own_document(): void
    {
        $student = $this->createStudent('doc_student_a', 'Siswa A');

        $document = $this->makeDocumentForStudent($student);

        Sanctum::actingAs($student);

        $this->deleteJson("/api/application-documents/{$document->id}")
            ->assertOk();

        $this->assertDatabaseMissing('application_documents', [
            'id' => $document->id,
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

    private function makeDocumentForStudent(User $student): ApplicationDocument
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

        $application = PklApplication::create([
            'student_id' => $student->id,
            'company_id' => $company->id,
            'pkl_period_id' => $period->id,
            'choice_order' => 1,
            'status' => 'pending',
        ]);

        return ApplicationDocument::create([
            'application_id' => $application->id,
            'document_type' => 'ktp',
            'document_name' => 'KTP',
            'file_path' => 'application-documents/ktp.pdf',
            'status' => 'pending',
        ]);
    }
}
