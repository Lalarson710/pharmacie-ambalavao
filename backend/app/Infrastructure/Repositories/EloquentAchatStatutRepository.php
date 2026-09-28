<?php

namespace App\Infrastructure\Repositories;

use App\Models\AchatStatut;
use App\Models\Achat;
use App\Application\Achat\Ports\AchatStatutRepositoryInterface;

class EloquentAchatStatutRepository implements AchatStatutRepositoryInterface
{
    public function lister(): array
    {
        return AchatStatut::orderBy('created_at', 'desc')->get()->all();
    }

    public function trouverParId(int $id): ?AchatStatut
    {
        return AchatStatut::find($id);
    }

    public function creer(array $donnees): AchatStatut
    {
        return AchatStatut::create($donnees);
    }

    public function modifier(
        AchatStatut $achatStatut,
        array $donnees
    ): AchatStatut {
        $achatStatut->update($donnees);

        return $achatStatut->fresh();
    }

    public function supprimer(AchatStatut $achatStatut): bool
    {
        return $achatStatut->delete();
    }

    public function listerParAchat(int $achatId): array
    {
        $statuts = AchatStatut::where('achat_id', $achatId)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($statuts->isEmpty()) {
            $achat = Achat::find($achatId);
            if ($achat) {
                $initial = AchatStatut::create([
                    'achat_id' => $achatId,
                    'statut_precedent' => null,
                    'nouveau_statut' => $achat->statut ?? 'brouillon',
                    'commentaire' => 'Achat créé',
                    'utilisateur_id' => null,
                ]);
                $statuts->push($initial);
            }
        }

        return $statuts->toArray();
    }
}
