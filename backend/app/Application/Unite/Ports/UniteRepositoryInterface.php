<?php

namespace App\Application\Unite\Ports;

use App\Models\Unite;

interface UniteRepositoryInterface
{
    public function lister(): array;
    public function trouverParId(int $id): ?Unite;
    public function creer(array $donnes): Unite;
    public function modifier(Unite $unite, array $donnes): Unite;
    public function supprimer(Unite $unite): bool;
}
