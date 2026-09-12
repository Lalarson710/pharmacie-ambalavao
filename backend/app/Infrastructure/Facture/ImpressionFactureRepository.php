<?php

namespace App\Infrastructure\Facture;

use App\Application\Facture\Ports\ImpressionFactureRepositoryInterface;
use App\Models\Facture;

class ImpressionFactureRepository
    implements ImpressionFactureRepositoryInterface
{
    public function obtenirDonnees(int $factureId): ?array
    {
        $facture = Facture::with([
            'vente.client',
            'vente.lignes.produit',
            'reglements',
        ])->find($factureId);

        if (!$facture) {
            return null;
        }

        return [
            'facture' => [
                'id' => $facture->id,
                'numero' => $facture->numero,
                'date' => $facture->date_facture?->format('d/m/Y'),
                'montant_total' => (float) $facture->montant_total,
                'statut' => $facture->statut,
            ],

            'client' => $facture->vente?->client
                ? [
                    'id' => $facture->vente->client->id,
                    'nom' => $facture->vente->client->nom,
                    'telephone' => $facture->vente->client->telephone,
                ]
                : null,

            'lignes' => $facture->vente?->lignes
                ->map(function ($ligne) {
                    return [
                        'produit' => $ligne->produit?->nom,
                        'quantite' => $ligne->quantite,
                        'prix_unitaire' => (float) $ligne->prix_unitaire,
                        'montant' => (float) $ligne->montant,
                    ];
                })
                ->values()
                ->all() ?? [],

            'reglements' => $facture->reglements
                ->map(function ($reglement) {
                    return [
                        'montant' => (float) $reglement->montant,
                        'mode' => $reglement->mode,
                        'date' => $reglement->date_reglement,
                        'reference' => $reglement->reference,
                    ];
                })
                ->values()
                ->all(),
        ];
    }
}