<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalRecommendation extends Model
{
    protected $fillable = [
        'journal_id',
        'recommendation',
        'is_selected',
        'is_applied',
    ];

    protected function casts(): array
    {
        return [
            'is_selected' => 'boolean',
            'is_applied' => 'boolean',
        ];
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }
}