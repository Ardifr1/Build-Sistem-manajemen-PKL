<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'placement_id',
        'attendance_date',
        'check_in',
        'check_out',
        'status',
        'photo_path',
        'latitude',
        'longitude',
        'location_accuracy',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
            'check_in' => 'datetime:H:i',
            'check_out' => 'datetime:H:i',
        ];
    }

    public function placement(): BelongsTo
    {
        return $this->belongsTo(PklPlacement::class, 'placement_id');
    }
}