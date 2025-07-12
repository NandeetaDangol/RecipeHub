<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Categories;
use App\Models\Recipe;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       $this->call([
            UserSeeder::class,
            CategoriesSeeder::class,
            RecipeSeeder::class,
            CommentSeeder::class,
            BookmarkSeeder::class,
            RecipeHistorySeeder::class,
            RecipeTagsSeeder::class,
            


        ]);
    }
}
