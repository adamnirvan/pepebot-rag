<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentVector extends Model
{
    protected $table = 'document_vectors';
    
    public $timestamps = false; 

    protected $hidden = ['embedding'];
}