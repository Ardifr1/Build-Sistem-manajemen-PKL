<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('placement_id')
                ->constrained('pkl_placements')
                ->cascadeOnDelete();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            // Aspek penilaian pengalaman PKL (PRD seksi 27), skala 1-5.
            $table->unsignedTinyInteger('lingkungan_kerja');
            $table->unsignedTinyInteger('pembimbing_industri');
            $table->unsignedTinyInteger('kesesuaian_bidang');
            $table->unsignedTinyInteger('pengalaman_belajar');
            $table->unsignedTinyInteger('kenyamanan');
            $table->unsignedTinyInteger('kesempatan_belajar');

            $table->text('komentar')->nullable();

            // BR-19: feedback direview sekolah sebelum jadi referensi.
            $table->string('status')->default('pending');

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();

            // Satu penempatan hanya boleh memiliki satu feedback.
            $table->unique('placement_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
