<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AssessmentComponentController;
use App\Http\Controllers\Admin\PklPeriodController;
use App\Http\Controllers\Admin\PklPlacementController;
use App\Http\Controllers\Admin\SchoolController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Company\ApplicationReviewController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Company\CompanySupervisorController;
use App\Http\Controllers\Student\ApplicationDocumentController;
use App\Http\Controllers\Student\AttendanceController;
use App\Http\Controllers\Student\JournalController;
use App\Http\Controllers\Student\JournalRecommendationController;
use App\Http\Controllers\Student\FeedbackController;
use App\Http\Controllers\Student\PklApplicationController;
use App\Http\Controllers\Student\ProgressRecordController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Teacher\FinalAssessmentController;
use App\Http\Controllers\Teacher\TeacherProfileController;
use App\Http\Controllers\AssessmentController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // Company
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('company-supervisors', CompanySupervisorController::class);

    // PKL Period
    Route::apiResource('pkl-periods', PklPeriodController::class);

    // PKL Application
    Route::apiResource('pkl-applications', PklApplicationController::class);
    Route::apiResource('application-documents', ApplicationDocumentController::class);
    Route::apiResource('application-reviews', ApplicationReviewController::class);

    // PKL Placement
    Route::apiResource('pkl-placements', PklPlacementController::class);

    // Schools (pengelompokan per sekolah, fondasi multi-sekolah)
    Route::apiResource('schools', SchoolController::class)->only(['index', 'store', 'update', 'destroy']);

    // Journal
    Route::apiResource('journals', JournalController::class);
    Route::post('/journals/{journal}/submit', [JournalController::class, 'submit']);
    Route::post('/journals/{journal}/verify', [JournalController::class, 'verify']);

    Route::apiResource(
        'journal-recommendations',
        JournalRecommendationController::class
    );

    // Attendance
    Route::apiResource('attendances', AttendanceController::class);

    // Progress
    Route::apiResource('progress-records', ProgressRecordController::class);

    // Feedback (PRD seksi 27, BR-19)
    Route::apiResource('feedbacks', FeedbackController::class);
    Route::post('/feedbacks/{feedback}/review', [FeedbackController::class, 'review']);

    // Assessment
    Route::apiResource(
        'assessment-components',
        AssessmentComponentController::class
    );

    Route::apiResource('assessments', AssessmentController::class);
    Route::apiResource('final-assessments', FinalAssessmentController::class);

    // Profile
    Route::apiResource('student-profiles', StudentProfileController::class);
    Route::apiResource('teacher-profiles', TeacherProfileController::class);

    // User
    Route::middleware('role:admin')->group(function () {
    Route::apiResource('users', UserController::class);
});
});