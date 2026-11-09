<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VillageSetting extends Model
{
    protected $fillable = [
        'desa_name',
        'petugas_wa',
        'website_url'
    ];
}