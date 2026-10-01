<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressRecord extends Model
{
    protected $fillable = [
        'placement_id',
        'recorded_by',
        'recorded_by_role',
        'development',
        'note',
        'recorded_date',
    ];

    protected function casts(): array
    {
        return [
            'recorded_date' => 'date',
        ];
    }

    public function placement(): BelongsTo
    {
        return $this->belongsTo(PklPlacement::class, 'placement_id');
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}