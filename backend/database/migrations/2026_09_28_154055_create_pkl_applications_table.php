<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pkl_applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            $table->foreignId('pkl_period_id')
                ->constrained('pkl_periods')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('choice_order')->nullable();

            $table->string('status')->default('pending');

            $table->text('student_note')->nullable();
            $table->text('company_note')->nullable();

            $table->timestamps();

            $table->unique(
                ['student_id', 'company_id', 'pkl_period_id'],
                'unique_student_company_period'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pkl_applications');
    }
};