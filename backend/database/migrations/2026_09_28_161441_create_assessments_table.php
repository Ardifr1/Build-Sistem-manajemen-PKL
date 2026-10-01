<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('placement_id')
                ->constrained('pkl_placements')
                ->cascadeOnDelete();

            $table->foreignId('component_id')
                ->constrained('assessment_components')
                ->cascadeOnDelete();

            $table->foreignId('assessed_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('assessor_role');

            $table->decimal('score', 5, 2);
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};