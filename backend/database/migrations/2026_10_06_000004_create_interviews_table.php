<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PRD §13 Seleksi dan Interview: penjadwalan interview oleh perusahaan.
     */
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')
                ->constrained('pkl_applications')
                ->cascadeOnDelete();
            $table->dateTime('scheduled_at')->nullable();
            $table->string('place')->nullable();
            $table->string('mode')->default('offline'); // offline | online
            $table->string('status')->default('scheduled'); // scheduled | done | cancelled
            $table->string('result')->nullable(); // passed | failed
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index('application_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
