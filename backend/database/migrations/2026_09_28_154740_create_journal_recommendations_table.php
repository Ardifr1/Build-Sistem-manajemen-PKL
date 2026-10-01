<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_recommendations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('journal_id')
                ->constrained('journals')
                ->cascadeOnDelete();

            $table->text('recommendation');
            $table->boolean('is_selected')->default(false);
            $table->boolean('is_applied')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_recommendations');
    }
};