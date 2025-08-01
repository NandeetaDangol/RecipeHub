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
        'images',
        'is_approved',
        'view_count',
    ];

    // protected $casts = [
    //     'ingredients' => 'array',
    //     'instructions' => 'array',
    //     'is_approved' => 'boolean',
    // ];


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

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'recipe_likes');
    }

    public function isLikedBy($userId)
    {
        return $this->recipeLikes()->where('user_id', $userId)->where('state', 'liked')->exists();
    }

    public function getUserLikeState($userId)
    {
        $like = $this->recipeLikes()->where('user_id', $userId)->first();
        return $like ? $like->state : null;
    }

    public function getLikesCountAttribute()
    {
        return $this->recipeLikes()->where('state', 'liked')->count();
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
