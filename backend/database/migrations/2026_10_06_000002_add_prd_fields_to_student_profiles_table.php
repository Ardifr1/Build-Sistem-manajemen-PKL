<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PRD §7 Profil Siswa: pengalaman, keahlian, CV, portofolio, sertifikat.
     */
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->text('pengalaman')->nullable()->after('address');
            $table->text('keahlian')->nullable()->after('pengalaman');
            $table->string('cv_path')->nullable()->after('keahlian');
            $table->string('portfolio_path')->nullable()->after('cv_path');
            $table->string('certificate_path')->nullable()->after('portfolio_path');
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'pengalaman',
                'keahlian',
                'cv_path',
                'portfolio_path',
                'certificate_path',
            ]);
        });
    }
};
