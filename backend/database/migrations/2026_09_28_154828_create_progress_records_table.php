<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress_records', function (Blueprint $table) {
            $table->id();

            $table->foreignId('placement_id')
                ->constrained('pkl_placements')
                ->cascadeOnDelete();

            $table->foreignId('recorded_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('recorded_by_role');
            $table->text('development');
            $table->text('note')->nullable();

            $table->date('recorded_date');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress_records');
    }
};