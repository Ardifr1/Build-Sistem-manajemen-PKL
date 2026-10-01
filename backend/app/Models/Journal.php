<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Journal extends Model
{
    protected $fillable = [
        'placement_id',
        'journal_date',
        'activity',
        'ai_suggestion',
        'revised_activity',
        'status',
        'teacher_note',
        'company_note',
        'submitted_at',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'journal_date' => 'date',
            'submitted_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function placement(): BelongsTo
    {
        return $this->belongsTo(PklPlacement::class, 'placement_id');
    }
}