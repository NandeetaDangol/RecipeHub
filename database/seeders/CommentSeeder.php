<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\User;
use App\Models\Recipe;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id')->toArray();
        $recipeIds = Recipe::pluck('id')->toArray();

        if (empty($userIds) || empty($recipeIds)) {
            $this->command->info('No users or recipes found to seed comments.');
            return;
        }

        for ($i = 0; $i < 10; $i++) {
            Comment::create([
                'user_id'     => $userIds[array_rand($userIds)],
                'recipe_id'   => $recipeIds[array_rand($recipeIds)],
                'text'        => 'This is a sample comment #' . ($i + 1),
                'date'        => now(),
                'is_approved' => rand(0, 1),
            ]);
        }
    }
}
