<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('placement_id')
                ->constrained('pkl_placements')
                ->cascadeOnDelete();

            $table->date('journal_date');
            $table->text('activity');
            $table->text('ai_suggestion')->nullable();
            $table->text('revised_activity')->nullable();

            $table->string('status')->default('draft');
            $table->text('teacher_note')->nullable();
            $table->text('company_note')->nullable();

            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            $table->unique(
                ['placement_id', 'journal_date'],
                'unique_placement_journal_date'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};