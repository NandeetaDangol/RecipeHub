<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category_id',
        'preparation_time',
        'cooking_time',
        'servings',
        'ingredients',
        'instructions',
        'image_url',
        'is_approved',
        'view_count',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function recipeLikes()
    {
        return $this->hasMany(RecipeLike::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function recipeHistories()
    {
        return $this->hasMany(RecipeHistory::class);
    }

    public function recipeTags()
    {
        return $this->hasMany(RecipeTags::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tags::class, 'recipe_tags', 'recipe_id', 'tag_id');
    }
}
