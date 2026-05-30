<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        Employee::create([
            'id' => 1, // Casando com o ID que o Django vai responder por enquanto
            'name' => 'Wanderson Heredia',
            'email' => 'wanderson@salao.com',
            'role' => 'Master Hair Stylist & Tech Coordinator',
            'pin_code' => '123456',
            'is_active' => true,
        ]);
    }
}