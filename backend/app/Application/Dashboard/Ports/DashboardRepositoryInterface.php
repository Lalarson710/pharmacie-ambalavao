<?php

namespace App\Application\Dashboard\Ports;

interface DashboardRepositoryInterface
{
    public function obtenir(): array;
}