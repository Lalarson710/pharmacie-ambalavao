<?php

namespace App\Http\Controllers\Sauvegarde;

use App\Application\Sauvegarde\CreerSauvegardeUseCase;
use App\Application\Sauvegarde\ListerSauvegardesUseCase;
use App\Application\Sauvegarde\RestaurerSauvegardeUseCase;
use App\Application\Sauvegarde\SupprimerFichierSauvegardeUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class SauvegardeController extends Controller
{
    public function index(
        ListerSauvegardesUseCase $useCase
    ) {
        return response()->json([
            'data' => $useCase->executer(),
        ]);
    }

    public function store(
        CreerSauvegardeUseCase $useCase
    ) {
        return response()->json([
            'message' => 'Sauvegarde créée avec succès.',
            'data' => $useCase->executer(),
        ], 201);
    }

    /**
     * Une sauvegarde est un fichier disque : elle est identifiee
     * par son nom de fichier, pas par un identifiant en base.
     */
    public function show(
        string $nomFichier,
        ListerSauvegardesUseCase $useCase
    ) {
        $sauvegarde = collect($useCase->executer())
            ->firstWhere('nom_fichier', $nomFichier);

        if (!$sauvegarde) {
            return response()->json([
                'message' => 'Sauvegarde introuvable.'
            ], 404);
        }

        return response()->json($sauvegarde);
    }

    public function destroy(
        SupprimerFichierSauvegardeUseCase $useCase,
        Request $request
    ) {
        $donnees = $request->validate([
            'nom_fichier' => 'required|string|max:255',
        ]);

        $useCase->executer($donnees['nom_fichier']);

        return response()->json([
            'message' => 'Sauvegarde supprimée avec succès.'
        ]);
    }

    public function restaurer(
        Request $request,
        RestaurerSauvegardeUseCase $useCase
    ) {
        $donnees = $request->validate([
            'nom_fichier' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $useCase->executer($donnees['nom_fichier']);

        return response()->json([
            'message' => 'Sauvegarde restaurée avec succès.',
        ]);
    }

    public function importer(Request $request)
    {
        $request->validate([
            'fichier' => [
                'required',
                'file',
                'mimes:sql,gz,zip,dump',
                'max:204800',
            ],
        ]);

        $fichier = $request->file('fichier');

        $extension = strtolower($fichier->getClientOriginalExtension());

        $dossier = storage_path('app/sauvegardes');

        if (!File::exists($dossier)) {
            File::makeDirectory($dossier, 0755, true);
        }

        // Le nom d'origine est conserve ; le suffixe unique
        // evite tout ecrasement en cas de doublon.
        $nomFichier = pathinfo($fichier->getClientOriginalName(), PATHINFO_FILENAME)
            . '_import_' . now()->format('Ymd_His') . '.' . $extension;

        $fichier->move($dossier, $nomFichier);

        return response()->json([
            'message' => 'Sauvegarde importée avec succès.',
            'data' => [
                'nom_fichier' => $nomFichier,
                'chemin' => $dossier . DIRECTORY_SEPARATOR . $nomFichier,
                'taille' => File::size($dossier . DIRECTORY_SEPARATOR . $nomFichier),
                'date_creation' => now()->toDateTimeString(),
            ],
        ], 201);
    }
}