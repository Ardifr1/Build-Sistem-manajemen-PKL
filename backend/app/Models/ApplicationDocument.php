<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationDocument extends Model
{
    protected $fillable = [
        'application_id',
        'document_type',
        'document_name',
        'file_path',
        'status',
        'review_note',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(PklApplication::class, 'application_id');
    }
}