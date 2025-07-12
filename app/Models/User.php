<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
   
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function viewedRecipes()
{
    return $this->belongsToMany(Recipe::class, 'user_recipe_views')
                ->withPivot('viewed_at')
                ->orderByPivot('viewed_at', 'desc');
}


    public function recipes()
    {
        return $this->hasMany(Recipe::class, 'user_id');
    }

    public function bookmarks()
    {
        return $this->belongsToMany(Bookmark::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function recipeLikes()
    {
        return $this->hasMany(RecipeLike::class);
    }

    public function recipeHistory()
    {
        return $this->hasMany(RecipeHistory::class);
    }

     public function tags()
    {
        return $this->hasMany(Tags::class);
    }

    public function recipeTags()
    {
        return $this->hasMany(RecipeTags::class);
    }
}
