<?php

namespace App\Application\Unite\Ports;

use App\Models\Unite;

interface UniteRepositoryInterface
{
    public function lister(): array;
}