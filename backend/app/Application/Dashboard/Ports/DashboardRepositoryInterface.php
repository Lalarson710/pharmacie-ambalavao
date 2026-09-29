<?php

namespace App\Application\Dashboard\Ports;

interface DashboardRepositoryInterface
{
    /**
     * Construit l'ensemble des indicateurs du tableau de bord.
     *
     * @param  int  $jours  Fenetre d'analyse (7, 30, 90 ou 365 jours).
     */
    public function obtenir(int $jours = 30): array;
}
