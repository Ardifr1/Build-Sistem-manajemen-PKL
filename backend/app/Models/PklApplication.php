<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PklApplication extends Model
{
    protected $fillable = [
        'student_id',
        'company_id',
        'pkl_period_id',
        'choice_order',
        'status',
        'student_note',
        'company_note',
    ];

    protected function casts(): array
    {
        return [
            'choice_order' => 'integer',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function pklPeriod(): BelongsTo
    {
        return $this->belongsTo(PklPeriod::class);
    }
}