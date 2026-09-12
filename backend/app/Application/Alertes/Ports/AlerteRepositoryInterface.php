<?php

namespace App\Application\Alertes\Ports;

interface AlerteRepositoryInterface
{
    public function stockFaible(): array;

    public function ruptures(): array;

    public function peremptions(int $jours): array;

    public function toutes(int $jours = 30): array;
}