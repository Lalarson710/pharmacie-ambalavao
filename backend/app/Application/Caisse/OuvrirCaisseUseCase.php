<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;
use App\Models\Caisse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OuvrirCaisseUseCase
{
    public function __construct(
        private CaisseRepositoryInterface $caisseRepository
    ) {
    }

    public function executer(
        int $userId,
        float $montantInitial
    ): Caisse {
        return DB::transaction(function () use (
            $userId,
            $montantInitial
        ) {
            $caisseExistante = $this->caisseRepository
                ->trouverCaisseOuverteParUtilisateur($userId);

            if ($caisseExistante) {
                throw new RuntimeException(
                    'Vous avez déjà une caisse ouverte.'
                );
            }

            if ($montantInitial < 0) {
                throw new RuntimeException(
                    'Le montant initial ne peut pas être négatif.'
                );
            }

            return $this->caisseRepository->creer([
                'user_id' => $userId,
                'date_ouverture' => now(),
                'montant_initial' => $montantInitial,
                'statut' => 'ouverte',
            ]);
        });
    }
}