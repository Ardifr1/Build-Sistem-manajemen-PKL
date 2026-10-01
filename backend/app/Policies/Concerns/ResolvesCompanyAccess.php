<?php

namespace App\Policies\Concerns;

use App\Models\CompanySupervisor;
use App\Models\User;

trait ResolvesCompanyAccess
{
    /**
     * Mengambil company_id yang menjadi kewenangan user (role company).
     *
     * Company tidak memiliki kolom user_id, sehingga kewenangan company
     * diselesaikan melalui tabel company_supervisors (user_id -> company_id).
     */
    protected function authorizedCompanyIds(User $user): array
    {
        return CompanySupervisor::query()
            ->where('user_id', $user->id)
            ->pluck('company_id')
            ->all();
    }

    /**
     * Menentukan apakah user (role company) berwenang terhadap company tertentu.
     */
    protected function isAuthorizedForCompany(User $user, int $companyId): bool
    {
        return in_array($companyId, $this->authorizedCompanyIds($user), true);
    }
}
