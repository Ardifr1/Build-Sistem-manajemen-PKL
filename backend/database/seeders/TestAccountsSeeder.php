<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class TestAccountsSeeder extends Seeder
{
    /**
     * Akun untuk testing manual. Aman dijalankan berulang (tidak duplikat).
     */
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Admin Sekolah',
                'username' => 'admin',
                'email' => 'admin@smk.sch.id',
                'password' => 'admin123',
                'role' => 'admin',
            ],
            [
                'name' => 'Guru Pembimbing',
                'username' => 'guru',
                'email' => 'guru@smk.sch.id',
                'password' => 'guru123',
                'role' => 'teacher',
            ],
            [
                'name' => 'Siswa Test',
                'username' => 'siswa',
                'email' => 'siswa@smk.sch.id',
                'password' => 'siswa123',
                'role' => 'student',
            ],
            [
                'name' => 'Pembimbing Industri',
                'username' => 'industri',
                'email' => 'industri@smk.sch.id',
                'password' => 'industri123',
                'role' => 'company',
            ],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [...$account, 'is_active' => true]
            );
        }
    }
}
