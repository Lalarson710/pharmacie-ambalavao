<?php

namespace App\Infrastructure\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;
use App\Models\Unite;

class UniteRepository implements UniteRepositoryInterface
{
    public function lister(): array
    {
        return Unite::where('actif', true)->get()->all();
    }
}