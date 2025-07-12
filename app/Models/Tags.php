<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tags extends Model
{
     protected $fillable = [
        'tag_id',
        'tag_name',
        ];

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'recipe_tag');
    }

    public function recipeTags()
    {
        return $this->hasMany(RecipeTags::class);
    }

    public function recipeLikes()
    {
        return $this->hasMany(RecipeLike::class);
    }

    public function recipeHistories()
    {
        return $this->hasMany(RecipeHistory::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}