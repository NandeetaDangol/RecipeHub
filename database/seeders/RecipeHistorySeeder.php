<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Recipe;
use App\Models\RecipeHistory;

class RecipeHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        $userIds = User::pluck('id')->toArray();
        $recipeIds = Recipe::pluck('id')->toArray();

        if (empty($userIds) || empty($recipeIds)) {
            $this->command->info('No users or recipes available for seeding recipe history.');
            return;
        }

        for ($i = 0; $i < 10; $i++) {
            RecipeHistory::create([
                'user_id'   => $userIds[array_rand($userIds)],
                'recipe_id' => $recipeIds[array_rand($recipeIds)],
                'date'      => now()->subDays(rand(0, 30)), 
            ]);
        }
    }
}
