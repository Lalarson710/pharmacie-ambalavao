<?php

namespace App\Application\Reglement;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Application\Reglement\Ports\ReglementRepositoryInterface;
use App\Models\Reglement;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use App\Application\Caisse\Ports\MouvementCaisseRepositoryInterface;
use App\Application\Caisse\Ports\CaisseRepositoryInterface;

class EnregistrerReglementUseCase
{
    public function __construct(
        private ReglementRepositoryInterface $reglementRepository,
        private FactureRepositoryInterface $factureRepository,
        private MouvementCaisseRepositoryInterface $mouvementCaisseRepository,
        private CaisseRepositoryInterface $caisseRepository
    ) {
    }

    public function executer(
        array $donnees,
        int $userId
    ): Reglement
    {
        return DB::transaction(function () use ($donnees, $userId) {

            $caisse = $this->caisseRepository
                ->trouverCaisseOuverteParUtilisateur($userId);

            if (!$caisse) {
                throw new RuntimeException(
                    'Aucune caisse ouverte pour cet utilisateur.'
                );
            }
            $facture = $this->factureRepository
                ->trouverParId($donnees['facture_id']);

            if (!$facture) {
                throw new RuntimeException(
                    'Facture introuvable.'
                );
            }

            if ($facture->statut === 'annulee') {
                throw new RuntimeException(
                    'Impossible de régler une facture annulée.'
                );
            }

            $reglementsExistants = $this->reglementRepository
                ->listerParFacture($facture->id);

            $montantDejaPaye = collect($reglementsExistants)
                ->sum('montant');

            $nouveauMontantPaye =
                $montantDejaPaye + $donnees['montant'];

            if ($nouveauMontantPaye > $facture->montant_total) {
                throw new RuntimeException(
                    'Le montant du règlement dépasse le montant restant à payer.'
                );
            }

            $reglement = $this->reglementRepository
                ->creer($donnees);

            $this->mouvementCaisseRepository->creer([
                'caisse_id' => $caisse->id,
                'reglement_id' => $reglement->id,
                'type' => 'entree',
                'montant' => $donnees['montant'],
                'motif' => 'Règlement de la facture ' . $facture->numero,
            ]);

            if ($nouveauMontantPaye == $facture->montant_total) {
                $statut = 'payee';
            } else {
                $statut = 'partiellement_payee';
            }

            $this->factureRepository->modifier(
                $facture,
                [
                    'statut' => $statut,
                ]
            );

            return $reglement;
        });
    }
}