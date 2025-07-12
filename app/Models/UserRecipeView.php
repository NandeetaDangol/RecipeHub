<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRecipeView extends Model
{
    protected $table = 'user_recipe_views';
    public $timestamps = false; // Because you're using viewed_at instead

    protected $fillable = ['user_id', 'recipe_id', 'viewed_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}

