<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'industry',
        'description',
        'address',
        'phone',
        'email',
        'student_quota',
        'required_skills',
        'required_documents',
        'is_partner',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'student_quota' => 'integer',
            'is_partner' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}