<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Absensi versi sekolah: foto selfie kamera + lokasi GPS real-time.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('photo_path')->nullable()->after('status');
            $table->decimal('latitude', 10, 7)->nullable()->after('photo_path');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->float('location_accuracy')->nullable()->after('longitude')
                ->comment('Akurasi lokasi GPS dalam meter');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'photo_path',
                'latitude',
                'longitude',
                'location_accuracy',
            ]);
        });
    }
};
