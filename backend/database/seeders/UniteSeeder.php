<?php

namespace Database\Seeders;

use App\Models\Unite;
use Illuminate\Database\Seeder;

class UniteSeeder extends Seeder
{
    public function run(): void
    {
        $unites = [
            [
                'nom' => 'Boîte',
                'abreviation' => 'Bte',
                'actif' => true,
            ],
            [
                'nom' => 'Flacon',
                'abreviation' => 'Flac',
                'actif' => true,
            ],
            [
                'nom' => 'Tube',
                'abreviation' => 'Tub',
                'actif' => true,
            ],
            [
                'nom' => 'Sachet',
                'abreviation' => 'Sct',
                'actif' => true,
            ],
            [
                'nom' => 'Comprimé',
                'abreviation' => 'Cp',
                'actif' => true,
            ],
            [
                'nom' => 'Ampoule',
                'abreviation' => 'Amp',
                'actif' => true,
            ],
        ];

        foreach ($unites as $unite) {
            Unite::updateOrCreate(
                ['nom' => $unite['nom']],
                [
                    'abreviation' => $unite['abreviation'],
                    'actif' => $unite['actif'],
                ]
            );
        }
    }
}