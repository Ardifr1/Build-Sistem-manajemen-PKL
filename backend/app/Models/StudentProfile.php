<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'student_number',
        'class',
        'major',
        'phone',
        'address',
        'pengalaman',
        'keahlian',
        'cv_path',
        'portfolio_path',
        'certificate_path',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}