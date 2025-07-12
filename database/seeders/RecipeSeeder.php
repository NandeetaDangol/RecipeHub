<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Recipe::create([
            'user_id' => 1, // Assuming the user with ID 1 exists
            'category_id' => 1, // Assuming the category with ID 1 exists

            'name' => 'Pizza',
            'description' => 'Pizza is a popular Italian-origin dish made with a round, flat base of dough that is typically 
            topped with tomato sauce, cheese, and a variety of ingredients like vegetables, meats, and herbs. ',
            'preparation_time' => '15 minutes',
            'cooking_time' => '15 minutes',
            'servings' => 2,
            'ingredients' => json_encode([
                'Pizza dough',
                'Pizza sauce',
                'Shredded mozzarella cheese',
                'Toppings (vegetables, meats)',
                'Olive oil (optional)',
                'Herbs (oregano, chili flakes) (optional)',
            ]),
            'instructions' => json_encode([
                'Preheat oven to 220°C (425°F).',
                'Roll out pizza dough on a floured surface to your desired thickness.',
                'Transfer dough to a pizza stone or baking sheet.',
                'Spread pizza sauce evenly over the dough, leaving a small border for the crust.',
                'Sprinkle shredded mozzarella cheese over the sauce.',
                'Add your desired toppings (e.g., pepperoni, mushrooms, bell peppers).',
                'Bake for 12-15 minutes, or until the crust is golden brown and the cheese is bubbly and slightly browned.',
                'Remove from oven, slice, and serve hot. Garnish with fresh herbs if desired.',
            ]),
            
            'image_url' => 'https://example.com/pizza.jpg',
            'submission_date' => now(),
            'is_approved' => true,
            'view_count' => 0,
        ]);
    }
}
