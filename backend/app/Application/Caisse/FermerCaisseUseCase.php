<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;
use App\Models\Caisse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class FermerCaisseUseCase
{
    public function __construct(
        private CaisseRepositoryInterface $caisseRepository,
    ) {
    }

    public function executer(
        Caisse $caisse,
        float $montantFinal
    ): Caisse {
        return DB::transaction(function () use (
            $caisse,
            $montantFinal
        ) {
            if ($caisse->statut !== 'ouverte') {
                throw new RuntimeException(
                    'Cette caisse est déjà fermée.'
                );
            }

            if ($montantFinal < 0) {
                throw new RuntimeException(
                    'Le montant final ne peut pas être négatif.'
                );
            }

            $montantTheorique = $this->caisseRepository
                ->calculerSoldeTheorique($caisse->id);

            $ecart = $montantFinal - $montantTheorique;

            return $this->caisseRepository->modifier(
                $caisse,
                [
                    'date_fermeture' => now(),
                    'montant_final' => $montantFinal,
                    'ecart' => $ecart,
                    'statut' => 'fermee',
                ]
            );
        });
    }
}