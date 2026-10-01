<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('final_assessments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('placement_id')
                ->unique()
                ->constrained('pkl_placements')
                ->cascadeOnDelete();

            $table->decimal('final_score', 5, 2);

            $table->string('status')->default('draft');

            $table->foreignId('finalized_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('finalized_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('final_assessments');
    }
};