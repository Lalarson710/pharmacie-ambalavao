<?php

namespace App\Infrastructure\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;
use RuntimeException;

class SauvegardeRepository implements SauvegardeRepositoryInterface
{
    private string $dossier;

    public function __construct()
    {
        $this->dossier = storage_path('app/sauvegardes');

        if (!File::exists($this->dossier)) {
            File::makeDirectory(
                $this->dossier,
                0755,
                true
            );
        }
    }

    public function creer(): array
    {
        $nomFichier = 'sauvegarde_' . now()->format('Y-m-d_H-i-s') . '.dump';

        $chemin = $this->dossier . DIRECTORY_SEPARATOR . $nomFichier;

        $process = new Process([
            'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',
            '--format=custom',
            '--file=' . $chemin,
            '--host=127.0.0.1',
            '--port=5432',
            '--username=postgres',
            'pharmacie_ambalavao',
        ]);

        $process->setEnv([
            'PGPASSWORD' => config('database.connections.pgsql.password'),
            'PATH' => getenv('PATH'),
            'SYSTEMROOT' => getenv('SYSTEMROOT'),
            'WINDIR' => getenv('WINDIR'),
        ]);

        $process->setTimeout(300);

        $process->run();

        if (!$process->isSuccessful()) {
            throw new RuntimeException(
                'La sauvegarde PostgreSQL a échoué. Code : ' .
                $process->getExitCode() .
                ' | Erreur : ' .
                $process->getErrorOutput()
            );
        }

        if (!File::exists($chemin)) {
            throw new RuntimeException(
                'La sauvegarde semble réussie mais le fichier n\'a pas été créé.'
            );
        }

        return [
            'nom_fichier' => $nomFichier,
            'chemin' => $chemin,
            'taille' => File::size($chemin),
            'date_creation' => now()->toDateTimeString(),
        ];
    }

    public function lister(): array
    {
        $fichiers = File::files($this->dossier);

        return collect($fichiers)
            ->filter(function ($fichier) {
                return $fichier->getExtension() === 'dump';
            })
            ->map(function ($fichier) {
                return [
                    'nom_fichier' => $fichier->getFilename(),
                    'chemin' => $fichier->getPathname(),
                    'taille' => $fichier->getSize(),
                    'date_creation' => date(
                        'Y-m-d H:i:s',
                        $fichier->getMTime()
                    ),
                ];
            })
            ->values()
            ->all();
    }

    public function restaurer(string $nomFichier): bool
    {
        $nomFichier = basename($nomFichier);

        $chemin = $this->dossier .
            DIRECTORY_SEPARATOR .
            $nomFichier;

        if (!File::exists($chemin)) {
            throw new RuntimeException(
                'Fichier de sauvegarde introuvable.'
            );
        }

        if (strtolower(File::extension($nomFichier)) !== 'dump') {
            throw new RuntimeException(
                'Fichier de sauvegarde invalide.'
            );
        }

        $process = new Process([
            'pg_restore',
            '--clean',
            '--if-exists',
            '--no-owner',
            '--host=' . config('database.connections.pgsql.host'),
            '--port=' . config('database.connections.pgsql.port'),
            '--username=' . config('database.connections.pgsql.username'),
            '--dbname=' . config('database.connections.pgsql.database'),
            $chemin,
        ]);

        $process->setEnv([
            'PGPASSWORD' => config(
                'database.connections.pgsql.password'
            ),
            'PATH' => getenv('PATH'),
            'SYSTEMROOT' => getenv('SYSTEMROOT'),
            'WINDIR' => getenv('WINDIR'),
        ]);

        $process->setTimeout(600);

        $process->run();

        if (!$process->isSuccessful()) {
            throw new RuntimeException(
                'La restauration PostgreSQL a échoué : ' .
                $process->getErrorOutput()
            );
        }

        return true;
    }
}