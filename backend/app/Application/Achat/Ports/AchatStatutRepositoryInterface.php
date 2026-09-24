<?php

namespace App\Application\Achat\Ports;

interface AchatStatutRepositoryInterface
{
    public function creer(array $donnes);
    public function listerParAchat(int $achatId): array;
}
