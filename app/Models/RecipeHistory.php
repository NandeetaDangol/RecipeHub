<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeHistory extends Model
{
      protected $fillable = [
        'user_id',
        'recipe_id',
        'date',
        'action',
        ];

        public function user()
    {
        return $this->belongsTo(User::class);
    }

        public function recipe()
    {
        return $this->belongsTo(Recipe::class); 
    }
}
