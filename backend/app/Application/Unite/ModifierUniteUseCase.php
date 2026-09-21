<?php

namespace App\Application\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;
use App\Models\Unite;

class ModifierUniteUseCase
{
    public function __construct(
        private UniteRepositoryInterface $uniteRepository
    ) {
    }

    public function executer(int $id, array $donnes): ?Unite
    {
        $unite = $this->uniteRepository->trouverParId($id);

        if (!$unite) {
            return null;
        }

        return $this->uniteRepository->modifier($unite, $donnes);
    }
}
