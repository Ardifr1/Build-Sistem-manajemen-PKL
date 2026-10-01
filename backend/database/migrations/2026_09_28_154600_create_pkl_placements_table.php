<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pkl_placements', function (Blueprint $table) {
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

            $table->foreignId('application_id')
                ->nullable()
                ->constrained('pkl_applications')
                ->nullOnDelete();

            $table->date('start_date');
            $table->date('end_date');

            $table->string('status')->default('active');

            $table->timestamps();

            $table->unique(
                ['student_id', 'pkl_period_id'],
                'unique_student_placement_period'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pkl_placements');
    }
};