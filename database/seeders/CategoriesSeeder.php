<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Nepali',
            'American',
            'Indian',
            'Chinese',
            'Italian',
            'Mexican',
            'Japanese',
            'Korean',
            'Thai',
            'Mediterranean',
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'type' => 'Cuisine',
            ]);
        }
    }
}
