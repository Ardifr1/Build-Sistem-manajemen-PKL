<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pkl_placements', function (Blueprint $table) {
            $table->foreignId('teacher_id')
                ->nullable()
                ->after('company_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('supervisor_id')
                ->nullable()
                ->after('teacher_id')
                ->constrained('company_supervisors')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pkl_placements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('supervisor_id');
            $table->dropConstrainedForeignId('teacher_id');
        });
    }
};
