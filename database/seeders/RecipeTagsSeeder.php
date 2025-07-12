<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Tag;
use App\Models\Tags;


class RecipeTagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'Spicy',
            'Vegan',
            'Gluten-Free',
            'Dessert',
            'Healthy',
            'Quick',
            'Easy',
            'Snack',
            'Breakfast',
            'Dinner',
            'Lunch',
            'Vegetarian',
        ];

        foreach ($tags as $name) {
            Tags::create([
                'tag_name' => $name,
                'tag_id' => Str::slug($name, '-') . '-' . rand(100, 999),
            ]);
        }
    }
}
