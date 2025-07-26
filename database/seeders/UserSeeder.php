<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      
        User::create([
            'name' => 'ram',
            'email' => 'ram@gmail.com',
            'password' => bcrypt('12345678'),
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),  // use a strong password here
            'is_admin' => true,
        ]);
    }
}
